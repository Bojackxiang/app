const request = require("request");
const url = "https://www.aisfexpo.com.au/api/checkdata";

exports.checkoutData = (req, res)=>{

  request(url, (err, response, data) => {
    dataList = response.body;
    var jsonObject = JSON.parse(dataList);
    res.render("data", {jsonData: jsonObject});
  });

}

exports.test = (req, res)=>{
    res.send("this is a test routes");
}