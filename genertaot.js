function test (id){
    var dateList = date.toString().split(" ");

    const dateDict = {
        "Jul" : "07",
        "Aug" : "08", 
    };
    var temp = "";
    temp += String(id);
    
    while (temp.length < 7){
        temp = "0"+temp;
    }
    var dateString = dateList[3]+dateDict[dateList[1]]+dateList[2]+temp;
    console.log(dateString)
    return dateString;
}

test(12)