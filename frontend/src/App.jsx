import { useEffect, useMemo, useState } from 'react'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [daily, setDaily] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState('')

  const [maxCalories, setMaxCalories] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [busy, setBusy] = useState(false)

  // ✅ Edit state
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCalories, setEditCalories] = useState('')

  const styles = useMemo(
    () => ({
      outer: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 16px',
      },
      page: {
        width: '100%',
        maxWidth: 1320,
        fontFamily: 'system-ui',
      },
      headerRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
      logo: {
        width: 44,
        height: 44,
        borderRadius: 14,
        display: 'grid',
        placeItems: 'center',
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(255,255,255,0.04)',
        fontSize: 22,
      },
      h1: { margin: 0, fontSize: 42, letterSpacing: -0.5 },
      sub: { margin: 0, opacity: 0.8 },

      // ⬇️ 2 kolon ana layout
      grid: { display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 14, alignItems: 'start' },

      card: {
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 14,
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
      },
      cardTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
      tag: {
        fontSize: 12,
        padding: '4px 8px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.15)',
        opacity: 0.9,
        whiteSpace: 'nowrap',
      },

      split: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 14 },
      row: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
      input: {
        width: '100%',
        padding: 10,
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(0,0,0,0.15)',
        color: 'inherit',
        outline: 'none',
      },
      textarea: {
        width: '100%',
        padding: 10,
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(0,0,0,0.15)',
        color: 'inherit',
        outline: 'none',
        minHeight: 90,
        resize: 'vertical',
      },
      button: {
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.22)',
        background: 'rgba(255,255,255,0.06)',
        color: 'inherit',
        cursor: 'pointer',
      },
      buttonPrimary: {
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.28)',
        background: 'rgba(80, 180, 120, 0.22)',
        color: 'inherit',
        cursor: 'pointer',
        fontWeight: 600,
      },
      toastErr: {
        background: 'rgba(220, 38, 38, 0.18)',
        border: '1px solid rgba(220, 38, 38, 0.35)',
        padding: 10,
        borderRadius: 12,
        marginBottom: 12,
      },
      toastOk: {
        background: 'rgba(34, 197, 94, 0.14)',
        border: '1px solid rgba(34, 197, 94, 0.35)',
        padding: 10,
        borderRadius: 12,
        marginBottom: 12,
      },

      // ⬇️ Tarif kartlarını 2-3 kolon yapar
      recipesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 14,
      },

      listItem: {
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.02)',
        padding: 14,
        borderRadius: 14,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
      },
      title: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
      muted: { opacity: 0.85, marginBottom: 8 },
      small: { fontSize: 12, opacity: 0.85 },

      actionsRight: { display: 'flex', gap: 10, alignItems: 'center' },
      dangerBtn: {
        height: 40,
        minWidth: 44,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(220, 38, 38, 0.18)',
        cursor: 'pointer',
      },
      editBtn: {
        height: 40,
        minWidth: 44,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(80, 140, 220, 0.18)',
        cursor: 'pointer',
      },

      // ✅ Modal
      modalBackdrop: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 50,
      },
      modal: {
        width: '100%',
        maxWidth: 560,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(30,30,30,0.95)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.45)',
        padding: 16,
      },
      modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
      modalTitle: { margin: 0, fontSize: 18, fontWeight: 800 },
      closeBtn: {
        height: 36,
        minWidth: 36,
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.06)',
        cursor: 'pointer',
      },
    }),
    []
  )

  const buildListUrl = () => {
    const qs = new URLSearchParams()
    if (maxCalories !== '') qs.set('max_calories', String(Number(maxCalories)))
    const q = qs.toString()
    return '/api/recipes' + (q ? '?' + q : '')
  }

  const loadRecipes = async () => {
    const res = await fetch(buildListUrl())
    const data = await res.json()
    setRecipes(data)
  }

  const loadDaily = async () => {
    const res = await fetch('/api/recipes/daily')
    const data = await res.json()
    setDaily(data)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await loadDaily()
        await loadRecipes()
      } catch (e) {
        setError(String(e))
      }
    })()
  }, [])

  const applyFilter = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    try {
      await loadRecipes()
      setInfo('Filtre uygulandı ✅')
    } catch (e2) {
      setError(String(e2))
    }
  }

  const submitRecipe = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          calories: calories ? Number(calories) : null,
        }),
      })

      if (res.status === 409) {
        setError('Bu başlıkta bir tarif zaten var. (Tekrar eklenmedi)')
        return
      }

      if (!res.ok) {
        setError('Tarif eklenemedi')
        return
      }

      setTitle('')
      setDescription('')
      setCalories('')
      setInfo('Tarif eklendi ✅')

      await loadDaily()
      await loadRecipes()
    } finally {
      setBusy(false)
    }
  }

  // ✅ Edit helpers
  const openEdit = (r) => {
    setEditId(r.id)
    setEditTitle(r.title ?? '')
    setEditDescription(r.description ?? '')
    setEditCalories(r.calories ?? '')
    setEditOpen(true)
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editId) return

    setError(null)
    setInfo(null)
    setBusy(true)

    try {
      const res = await fetch('/api/recipes/' + editId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          calories: editCalories === '' ? null : Number(editCalories),
        }),
      })

      if (res.status === 409) {
        setError('Bu başlıkta bir tarif zaten var. (Güncellenmedi)')
        return
      }

      if (!res.ok) {
        const t = await res.text()
        setError('Güncelleme başarısız: ' + t)
        return
      }

      setInfo('Güncellendi ✅ (id: ' + editId + ')')
      setEditOpen(false)
      await loadDaily()
      await loadRecipes()
    } finally {
      setBusy(false)
    }
  }

  const deleteRecipe = async (id) => {
    const ok = confirm('Tarif silinsin mi? (id: ' + id + ')')
    if (!ok) return

    setError(null)
    setInfo(null)
    setBusy(true)

    try {
      const res = await fetch('/api/recipes/' + id, { method: 'DELETE' })
      if (!res.ok) {
        setError('Silme başarısız')
        return
      }
      setInfo('Silindi ✅')
      await loadDaily()
      await loadRecipes()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={styles.outer}>
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <div style={styles.logo}>{'🥗'}</div>
          <div>
            <h1 style={styles.h1}>Sağlıklı Tarifler</h1>
            <p style={styles.sub}>Günlük öneri, kalori filtresi ve hızlı kayıt.</p>
          </div>
        </div>

        {error && <div style={styles.toastErr}>{error}</div>}
        {info && <div style={styles.toastOk}>{info}</div>}

        {/* 1) Günün Tarifi - full width */}
        <div style={styles.card}>
          <div style={styles.cardTitleRow}>
            <h3 style={{ margin: 0 }}>🌟 Günün Tarifi</h3>
            <span style={styles.tag}>Toplam: {recipes.length}</span>
          </div>

          {daily?.message ? (
            <p>Henüz tarif yok. Aşağıdan ilk tarifini ekle 🙂</p>
          ) : daily ? (
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{daily.title}</div>
              <div style={{ marginTop: 6, opacity: 0.9 }}>{daily.description}</div>
              <div style={{ marginTop: 10, ...styles.small }}>🔥 {daily.calories} kcal</div>
            </div>
          ) : (
            <p>Yükleniyor...</p>
          )}
        </div>

        <div style={{ height: 14 }} />

        {/* 2) Filtre + Yeni Tarif - yan yana geniş */}
        <div style={styles.split}>
          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>🔎 Filtre</h3>
            <form onSubmit={applyFilter}>
              <div style={styles.row}>
                <input
                  type='number'
                  placeholder='Maksimum kalori (örn 400)'
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ ...styles.row, marginTop: 10 }}>
                <button type='submit' style={styles.buttonPrimary} disabled={busy}>
                  Uygula
                </button>
                <button
                  type='button'
                  style={styles.button}
                  disabled={busy}
                  onClick={async () => {
                    setMaxCalories('')
                    await loadRecipes()
                    setInfo('Filtre sıfırlandı ✅')
                  }}
                >
                  Sıfırla
                </button>
              </div>
            </form>
          </div>

          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>➕ Yeni Tarif</h3>
            <form onSubmit={submitRecipe}>
              <input
                placeholder='Başlık'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
              />
              <div style={{ height: 10 }} />
              <textarea
                placeholder='Açıklama'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
              />
              <div style={{ height: 10 }} />
              <input
                type='number'
                placeholder='Kalori (örn 350)'
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                style={styles.input}
              />
              <div style={{ height: 10 }} />
              <button type='submit' style={styles.buttonPrimary} disabled={busy}>
                {busy ? 'İşleniyor…' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ height: 14 }} />

        {/* 3) Tarifler - grid kartlar */}
        <div style={styles.card}>
          <div style={styles.cardTitleRow}>
            <h3 style={{ margin: 0 }}>📚 Tarifler</h3>
            <span style={styles.tag}>Gösterilen: {recipes.length}</span>
          </div>

          <div style={{ height: 12 }} />

          {recipes.length === 0 ? (
            <p style={{ opacity: 0.85 }}>Henüz tarif yok. İlk tarifini ekleyerek başlayabilirsin 🙂</p>
          ) : (
            <div style={styles.recipesGrid}>
              {recipes.map((r) => (
                <div key={r.id} style={styles.listItem}>
                  <div>
                    <div style={styles.title}>{r.title}</div>
                    <div style={styles.muted}>{r.description}</div>
                    <div style={styles.small}>🔥 {r.calories} kcal</div>
                  </div>

                  <div style={styles.actionsRight}>
                    <button
                      onClick={() => openEdit(r)}
                      style={styles.editBtn}
                      title='Düzenle'
                      disabled={busy}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => deleteRecipe(r.id)}
                      style={styles.dangerBtn}
                      title='Sil'
                      disabled={busy}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {editOpen && (
        <div style={styles.modalBackdrop} onMouseDown={() => setEditOpen(false)}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>✏️ Tarif Düzenle</h3>
              <button style={styles.closeBtn} onClick={() => setEditOpen(false)} title='Kapat'>
                ✖
              </button>
            </div>

            <div style={{ height: 12 }} />

            <form onSubmit={saveEdit}>
              <input
                placeholder='Başlık'
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                style={styles.input}
              />
              <div style={{ height: 10 }} />
              <textarea
                placeholder='Açıklama'
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={styles.textarea}
              />
              <div style={{ height: 10 }} />
              <input
                type='number'
                placeholder='Kalori'
                value={editCalories}
                onChange={(e) => setEditCalories(e.target.value)}
                style={styles.input}
              />

              <div style={{ height: 12 }} />

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type='button' style={styles.button} onClick={() => setEditOpen(false)} disabled={busy}>
                  Vazgeç
                </button>
                <button type='submit' style={styles.buttonPrimary} disabled={busy}>
                  {busy ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}