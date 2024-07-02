const db = require("../config/database");

const addDinningPlace = async( req, res) =>{
     var {name, address, phone_no, website,operational_hours,} = req.body;
     const{open_time,close_time}  = operational_hours;
    
     console.log(" data : ",name, address, phone_no, website,operational_hours);

     try{
        const response = await db.query(`insert into dinning_places (name, address, phone_no, website,open_time, close_time) values (?,?,?,?,?,?) `, [name, address, phone_no, website,open_time, close_time]);
        if(response[0].insertId){
            return res.status(200).json({
                
                 "message": name + " added successfully",
                "place_id": response[0].insertId,
                 "status_code": 200
            })
        }
        else {
            return res.status(401).json({
                
                "message": name + " cannot be added ",
                  
                "status_code": 401
           })
        }
     }
     catch(error){
        console.log("\n error in  dinningapoi", error);
     }
}

const searchDinningPlaces = async (req, res)=>{
    const name = req.params.name;
    console.log("name", name, req.params);

    try{
        const response = await db.query(`select * from dinning_places where name like N'%${name}%'`);
        console.log(" response : ",response);
        if(response[0].length > 0){
            return res.status(200).json({
                data : response[0]
            })
        }
    }
    catch(error){
        return res.status(401).json({
            message : "error in search dinning place api  " + error
        })
    }

}

const makeBooking = async(req, res)=>{
  const {place_id, start_time, end_time} = req.body;

  try{
  


     const checkSlot = await db.query(`
    SELECT * FROM booked_slots 
    WHERE place_id = ? 
    AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))`,[place_id, start_time, start_time, end_time, end_time]);
     console.log(" response : ", checkSlot);
     if(checkSlot[0]){
        const response = await db.query('insert into booked_slots (place_id, start_time, end_time) values (?,datetime(?),datetime(?))', [place_id, start_time, end_time]);
        console.log("response  insert : ",response);
        return res.status(200).json({
            status : "Slot booked successfully",
            status_code : "200",
            booking_id : response[0].insertId
        })
     }
    }
  catch(error){
    return res.status(401).json({
        message : "error in make booking api  " + error
    })
}
}
module.exports = {addDinningPlace, searchDinningPlaces, makeBooking};

