/**
 * InfinitePay API Client (Checkout Integrado / External Checkout)
 * Documentação oficial: https://app.infinitepay.io/external-checkout#documentacao
 * Endpoint: POST https://api.checkout.infinitepay.io/links
 */

export interface CreateInfinitePayLinkParams {
  orderNsu: string;
  amountInCents: number;
  planName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  redirectUrl?: string;
  webhookUrl?: string;
}

export interface InfinitePayLinkResponse {
  url: string;
  order_nsu: string;
  amount?: number;
  status?: string;
}

export async function createInfinitePayLink(params: CreateInfinitePayLinkParams): Promise<InfinitePayLinkResponse> {
  // A InfinitePay suporta autenticação via X-Api-Key OU via InfiniteTag (handle)
  const apiKey = process.env.INFINITEPAY_API_KEY;
  // Handle da conta conforme visto no painel ($cth20 -> "cth20")
  const handle = process.env.INFINITEPAY_HANDLE || "cth20";

  const appUrl = process.env.VITE_APP_URL || "https://app.montanhapersonalstudio.com.br";
  const redirectUrl = params.redirectUrl || `${appUrl}/portal/planos?status=success`;
  const webhookUrl = params.webhookUrl || `${appUrl}/api/payments/infinitepay-webhook`;

  // Payload padrão aceito pela API da InfinitePay External Checkout
  const payload: Record<string, any> = {
    handle: handle.replace(/^\\$/, ""),
    order_nsu: params.orderNsu,
    redirect_url: redirectUrl,
    webhook_url: webhookUrl,
    items: [
      {
        quantity: 1,
        price: params.amountInCents,
        description: `Plano Studio: ${params.planName}`,
      },
    ],
    customer: {
      name: params.customerName,
      email: params.customerEmail || "aluno@montanhastudio.com.br",
      phone: params.customerPhone ? params.customerPhone.replace(/\\D/g, "") : undefined,
    },
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["X-Api-Key"] = apiKey;
  }

  const response = await fetch("https://api.checkout.infinitepay.io/links", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[InfinitePay API Error]:", response.status, errorText);
    throw new Error(`Erro na API InfinitePay (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    url: data.url || data.checkout_url || data.link,
    order_nsu: params.orderNsu,
    amount: params.amountInCents,
  };
}
