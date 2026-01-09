 const auth = (req, res, next)=>{
    // res.send('hello from server test')
    const token = 'xyz';
    const isAuth = token === 'xyzq';
    if(isAuth){
        next();
    }else{
        res.status(401).send('no authentication')
    }
}

module.exports = {auth}