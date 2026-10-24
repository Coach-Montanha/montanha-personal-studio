/**
 * InfinitePay API Client (Checkout Integrado)
 * Oficial: https://api.checkout.infinitepay.io/links
 */

export interface CreateInfinitePayLinkParams {
  orderNsu: string;
  amountInCents: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  redirectUrl?: string;
}

export interface InfinitePayLinkResponse {
  url: string;
  order_nsu: string;
  amount: number;
  status?: string;
}

export async function createInfinitePayLink(params: CreateInfinitePayLinkParams): Promise<InfinitePayLinkResponse> {
  const apiKey = process.env.INFINITEPAY_API_KEY;
  if (!apiKey) {
    throw new Error("INFINITEPAY_API_KEY não configurada no ambiente (.env).");
  }

  const payload = {
    order_nsu: params.orderNsu,
    amount: params.amountInCents,
    redirect_url: params.redirectUrl || process.env.VITE_APP_URL || "https://app.montanhapersonalstudio.com.br/portal",
    customer: {
      name: params.customerName,
      email: params.customerEmail || "contato@montanhastudio.com.br",
      phone: params.customerPhone || undefined,
    },
  };

  const response = await fetch("https://api.checkout.infinitepay.io/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API InfinitePay (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data as InfinitePayLinkResponse;
}
