from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import select, func
from datetime import date

from app.db.session import get_db
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate

router = APIRouter(prefix="/recipes", tags=["recipes"])


class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    calories: Optional[int] = None


@router.get("")
def list_recipes(
    max_calories: int | None = Query(default=None, ge=0),
    db: Session = Depends(get_db),
):
    stmt = select(Recipe).order_by(Recipe.id.desc())
    if max_calories is not None:
        stmt = stmt.where(Recipe.calories.is_not(None)).where(Recipe.calories <= max_calories)

    items = db.execute(stmt).scalars().all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "calories": r.calories,
        }
        for r in items
    ]


@router.post("")
def create_recipe(payload: RecipeCreate, db: Session = Depends(get_db)):
    title_clean = payload.title.strip()

    # Duplicate kontrol (case-insensitive)
    existing = db.execute(
        select(Recipe).where(func.lower(Recipe.title) == func.lower(title_clean))
    ).scalars().first()

    if existing:
        raise HTTPException(status_code=409, detail="Recipe with this title already exists")

    r = Recipe(
        title=title_clean,
        description=payload.description,
        calories=payload.calories,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return {"id": r.id}


@router.put("/{recipe_id}")
def update_recipe(recipe_id: int, payload: RecipeUpdate, db: Session = Depends(get_db)):
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # En az bir alan gelmeli
    if payload.title is None and payload.description is None and payload.calories is None:
        raise HTTPException(status_code=400, detail="No fields to update")

    # title update + duplicate kontrol
    if payload.title is not None:
        title_clean = payload.title.strip()
        if not title_clean:
            raise HTTPException(status_code=400, detail="Title cannot be empty")

        existing = db.execute(
            select(Recipe).where(
                func.lower(Recipe.title) == func.lower(title_clean),
                Recipe.id != recipe_id,
            )
        ).scalars().first()

        if existing:
            raise HTTPException(status_code=409, detail="Recipe with this title already exists")

        recipe.title = title_clean

    # description update
    if payload.description is not None:
        recipe.description = payload.description.strip()

    # calories update
    if payload.calories is not None:
        if payload.calories < 0:
            raise HTTPException(status_code=400, detail="Calories must be >= 0")
        recipe.calories = payload.calories

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    return {
        "id": recipe.id,
        "title": recipe.title,
        "description": recipe.description,
        "calories": recipe.calories,
    }


@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db.delete(recipe)
    db.commit()
    return {"deleted_id": recipe_id}


@router.get("/daily")
def daily_recipe(db: Session = Depends(get_db)):
    items = db.execute(select(Recipe).order_by(Recipe.id.asc())).scalars().all()
    if not items:
        return {"message": "No recipes yet"}

    today = date.today().toordinal()
    idx = today % len(items)
    r = items[idx]

    return {
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "calories": r.calories,
        "daily_index": idx,
        "total_recipes": len(items),
    }