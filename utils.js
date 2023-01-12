function makeid(length) {
  let result = "";
  let characters = "abcdef01234567890123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.makeID = makeid;
