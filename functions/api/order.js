/**
 * Cloudflare Pages Function — Dr.Cash API integration
 * POST /api/order  { name, phone, sub1..sub5 }
 * Offer: Dr.Prost TR — offer_id 28462
 */

const CC = '90'; // Turkey
const TOKEN = 'ODA5NDLKMTUTMDZMYS00NDQZLWJHYJITZDEZYMEWZJE1NTFH';
const STREAM = '28462';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const name = (body.name || '').trim();
    const rawPhone = (body.phone || '').trim();

    if (!name || !rawPhone) {
      return Response.json({ error: true, message: 'Name and phone required' }, { status: 400 });
    }

    let d = rawPhone.replace(/\D+/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    d = d.replace(/^0+/, '');
    if (!d.startsWith(CC)) d = CC + d;
    const phone = '+' + d;

    const payload = {
      stream_code: STREAM,
      client: { phone: phone, name: name },
    };

    if (body.sub1) payload.sub1 = body.sub1;
    if (body.sub2) payload.sub2 = body.sub2;
    if (body.sub3) payload.sub3 = body.sub3;
    if (body.sub4) payload.sub4 = body.sub4;
    if (body.sub5) payload.sub5 = body.sub5;

    const res = await fetch('https://order.drcash.sh/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let result;
    try { result = JSON.parse(responseText); } catch { result = { raw: responseText }; }

    if (res.status === 200 && result.uuid) {
      return Response.json({ error: false, trackId: result.uuid });
    }
    return Response.json({ error: true, message: 'dr.cash error', status: res.status, response: result }, { status: 200 });
  } catch (err) {
    return Response.json({ error: true, message: err.message }, { status: 500 });
  }
}

export async function onRequestGet() {
  return Response.json({ status: 'ok', service: 'order-api' });
}
