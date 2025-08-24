const API_BASE_URL = 'https://inv-boda-backend.onrender.com';

export interface Invitado {
  name: string;
  phone: string;
  maxGuests: number;
}

export interface FindInvitadoResponse {
  success: boolean;
  invitado?: Invitado;
  message?: string;
}

export const findInvitado = async (name: string, phone: string): Promise<FindInvitadoResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/invitados/find`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error buscando invitado:', error);
    return {
      success: false,
      message: 'Error de conexión. Intenta nuevamente.',
    };
  }
};
