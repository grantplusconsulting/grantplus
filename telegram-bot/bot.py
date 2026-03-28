import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import time
import os

TOKEN = "8410455558:AAFIQeZcbbDjEX7Er7WnB75nNCOgmHpQhAI"
CHANNEL_USERNAME = "@grantplus"
FILE_PATH = r"C:\Users\User\Desktop\Website\telegram-bot\Qollanma.txt"

# Initialize bot
bot = telebot.TeleBot(TOKEN)

def is_subscribed(user_id):
    try:
        member = bot.get_chat_member(CHANNEL_USERNAME, user_id)
        if member.status in ['member', 'administrator', 'creator']:
            return True
        return False
    except Exception as e:
        print(f"Error checking subscription: {e}")
        # Return False when an error occurs, possibly the bot is not admin in the channel
        return False

def send_subscription_keyboard(chat_id):
    markup = InlineKeyboardMarkup()
    url = f"https://t.me/{CHANNEL_USERNAME.replace('@', '')}"
    markup.add(InlineKeyboardButton("Kanalga obuna bo'lish 📢", url=url))
    markup.add(InlineKeyboardButton("Obuna bo'ldim ✅", callback_data="check_sub"))
    bot.send_message(
        chat_id, 
        "Assalomu alaykum!\n\nJanubiy Koreyaga borishdan tortib moslashgungacha jarayonda sizga yordam beradigan <b>“BEPUL QO’LLANMA”</b>ni olish uchun kanalimizga obuna bo’ling! 👇🏻", 
        parse_mode="HTML", 
        reply_markup=markup
    )

@bot.message_handler(commands=['start'])
def send_welcome(message):
    user_id = message.from_user.id
    if is_subscribed(user_id):
        if os.path.exists(FILE_PATH):
            try:
                with open(FILE_PATH, 'rb') as doc:
                    bot.send_document(message.chat.id, doc, caption="Bepul qo‘llanmangiz tayyor! 📩\nYuklab oling va hoziroq foydalanishni boshlang.")
            except Exception as e:
                bot.send_message(message.chat.id, "Kechirasiz, faylni yuklashda xatolik yuz berdi.")
                print(e)
        else:
            bot.send_message(message.chat.id, "Kechirasiz, qo'llanma fayli topilmadi.")
    else:
        send_subscription_keyboard(message.chat.id)

@bot.callback_query_handler(func=lambda call: call.data == "check_sub")
def check_callback(call):
    user_id = call.from_user.id
    if is_subscribed(user_id):
        bot.answer_callback_query(call.id, "Tabriklaymiz! Siz kanalga a'zo bo'ldingiz.")
        bot.delete_message(call.message.chat.id, call.message.message_id)
        if os.path.exists(FILE_PATH):
            try:
                with open(FILE_PATH, 'rb') as doc:
                    bot.send_document(call.message.chat.id, doc, caption="Bepul qo‘llanmangiz tayyor! 📩\nYuklab oling va hoziroq foydalanishni boshlang.")
            except Exception as e:
                bot.send_message(call.message.chat.id, "Kechirasiz, faylni yuklashda xatolik yuz berdi.")
                print(e)
        else:
            bot.send_message(call.message.chat.id, "Kechirasiz, qo'llanma fayli topilmadi.")
    else:
        bot.answer_callback_query(call.id, "Kanalga hali obuna bo‘lmadingiz 🙂\nQo‘llanmani olish uchun iltimos, avval obuna bo‘ling 👇", show_alert=True)

if __name__ == '__main__':
    print("Bot is successfully running... Press Ctrl+C to stop.")
    while True:
        try:
            bot.polling(none_stop=True, interval=0)
        except Exception as e:
            print(f"Polling error: {e}")
            time.sleep(5)
