module.exports = function mapMessage(msg) {
    return {
        date: msg.date,
        text: msg.text,
        id: msg._id,
        user: msg.user,
    };
  };
  