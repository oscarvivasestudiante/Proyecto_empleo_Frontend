export async function getAllJobs() {
  try {
    const response = await fetch('http://localhost:4000/jobs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include', // Si necesitas enviar cookies
    });

    if (!response.ok) {
      throw new Error('Error al obtener los trabajos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllJobs:', error);
    return [];
  }
}

export async function getJobById(id) {
  const res = await fetch(`http://localhost:4000/jobs/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener el trabajo");
  return await res.json();
}