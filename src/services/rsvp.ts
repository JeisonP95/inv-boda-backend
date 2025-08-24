const API_BASE_URL = 'https://inv-boda-backend.onrender.com';

export interface RSVPPayload {
  name: string;
  phone: string;
  attending: boolean;
  guests?: number;
}

export interface RSVPResponse {
  success: boolean;
  message?: string;
  rsvp?: any;
}

export const enviarRSVP = async (payload: RSVPPayload): Promise<RSVPResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error enviando RSVP:', error);
    return {
      success: false,
      message: 'Error de conexión. Intenta nuevamente.',
    };
  }
};
