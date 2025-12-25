from pydantic import BaseModel

class RecipeCreate(BaseModel):
    title: str
    description: str | None = None
    calories: int | None = None
