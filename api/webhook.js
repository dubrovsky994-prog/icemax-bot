// 🤖 ICEMan Bot for MAX Messenger
const BOT_TOKEN = process.env.BOT_TOKEN || "f9LHodD0cOKZBlFn6bQGSi_mJfHTHJTrmy4dgzwZCScmBTcLbmtN3ubTTKPHZN3CuZ4zvi_gsOwfwv3AiQ9L";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "229831120";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  try {
    const { message = {} } = req.body;
    const chat_id = message.chat_id || message.chat?.id;
    const text = (message.text || "").toLowerCase().trim();
    const user_name = message.from?.name || "Клиент";

    if (!chat_id) return res.status(200).send("OK");

    let reply = "";

    if (text.includes("цена") || text.includes("стоимость") || text.includes("сколько")) {
      reply = "💰 Заправка автокондиционера: от 1 500 ₽\n• Диагностика — бесплатно\n• Гарантия 12 месяцев";
    } else if (text.includes("адрес") || text.includes("где") || text.includes("находитесь")) {
      reply = "📍 Пенза, ул. Примерная, 42\n🕐 Пн-Вс: 9:00–20:00";
    } else if (text.includes("запись") || text.includes("календар") || text.includes("записаться")) {
      reply = "📅 Запишитесь онлайн: [Открыть форму](https://app.iceman-penza.ru)";
    } else if (text.includes("гарантия")) {
      reply = "✅ Гарантия 12 месяцев на все работы.\nЧек + акт.";
    } else if (text.includes("контакт") || text.includes("телефон") || text.includes("связаться")) {
      reply = "📞 +7 (999) 123-45-67\n💬 Telegram: @iceman_penza";
    }

    if (reply) {
      await sendMaxMessage(chat_id, reply);
      return res.status(200).send("OK");
    }

    await sendMaxMessage(chat_id, "🔄 Передаю специалисту. Отвечу за 2 минуты!");
    await sendMaxMessage(ADMIN_CHAT_ID, `❗ Вопрос от ${user_name}:\n"${message.text}"`);
    
    return res.status(200).send("OK");
  } catch (e) {
    console.error("Bot error:", e);
    return res.status(500).send("Error");
  }
}

async function sendMaxMessage(chat_id, text) {
  try {
    await fetch("https://platform-api.max.ru/messages", {
      method: "POST",
      headers: { "Authorization": BOT_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text, format: "markdown" })
    });
  } catch (err) {
    console.error("Send error:", err);
  }
}
