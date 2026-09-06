import { Resend } from 'resend';

interface ContactRequest {
  owner: string;
  size: string;
  objective: string;
  services: string[];
  budget: string;
  name: string;
  email: string;
  phone: string;
  context: string;
}

interface ContactResponse {
  status: number;
  body: {
    success?: boolean;
    id?: string;
    error?: string;
  };
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const cleanText = (value: unknown, maxLength: number): string => {
  if (typeof value !== 'string') return '';

  return value.trim().slice(0, maxLength);
};

const parseContactRequest = (input: unknown): ContactRequest | null => {
  if (!isRecord(input)) return null;

  const owner = cleanText(input.owner, 100);
  const size = cleanText(input.size, 100);
  const objective = cleanText(input.objective, 500);
  const budget = cleanText(input.budget, 100);
  const name = cleanText(input.name, 150);
  const email = cleanText(input.email, 254);
  const phone = cleanText(input.phone, 50);
  const context = cleanText(input.context, 5000);

  const services = Array.isArray(input.services)
    ? input.services
        .filter((service): service is string => typeof service === 'string')
        .map((service) => service.trim().slice(0, 150))
        .filter(Boolean)
        .slice(0, 20)
    : [];

  if (
    !owner ||
    !size ||
    !objective ||
    !budget ||
    !name ||
    !email ||
    services.length === 0
  ) {
    return null;
  }

  if (!emailPattern.test(email)) {
    return null;
  }

  return {
    owner,
    size,
    objective,
    services,
    budget,
    name,
    email,
    phone,
    context,
  };
};

export const processContactRequest = async (
  input: unknown,
): Promise<ContactResponse> => {
  const request = parseContactRequest(input);

  if (!request) {
    return {
      status: 400,
      body: {
        error: 'Invalid or missing fields',
      },
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !contactEmail || !fromEmail) {
    console.error('Missing email environment configuration');

    return {
      status: 500,
      body: {
        error: 'Email service unavailable',
      },
    };
  }

  const resend = new Resend(apiKey);

  const emailBody = `NOVO PEDIDO DE ORÇAMENTO — AXION WEBSITE

DIAGNÓSTICO INICIAL

Papel na empresa:
${request.owner}

Dimensão da operação:
${request.size}

Objetivo do projeto:
${request.objective}

Serviços selecionados:
${request.services.map((service) => `- ${service}`).join('\n')}

Budget previsto:
${request.budget}


CONTEXTO ADICIONAL DO PROJETO

${request.context || 'Não facultado'}


DADOS DE CONTACTO

Nome / Empresa:
${request.name}

E-mail:
${request.email}

Telefone:
${request.phone || 'Não facultado'}


Pedido recebido através do website da AXION.`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [contactEmail],
      replyTo: request.email,
      subject: `Novo pedido de orçamento — ${request.name.replace(/[\r\n]/g, ' ')}`,
      text: emailBody,
    });

    if (error) {
      console.error('Resend error:', error);

      return {
        status: 502,
        body: {
          error: 'Unable to send email',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        id: data?.id,
      },
    };
  } catch (error) {
    console.error('Email sending error:', error);

    return {
      status: 500,
      body: {
        error: 'Unable to send email',
      },
    };
  }
};