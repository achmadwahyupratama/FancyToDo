function errorHandler(err, req, res, next){
    switch(err.name){
        case "SequelizeValidationError":
            let errs = []
            err.errors.forEach(element => {
                errs.push({message: element.message})
            });
            res.status(400).json({errors: errs});
            break;
        case "Not Found":
            res.status(404).json({errors: {message: err.message}});
            break;
        case "SequelizeUniqueConstraintError":
            res.status(400).json({errors: {message: err.message}});
            break;
        case "invalid email and password":
            res.status(400).json({errors: {message: err.name}});
            break;
        case "Invalid access token":
            res.status(403).json({errors: {message: err.name}});
            break;
        case "Authorization Error":
            res.status(401).json({errors: {message: err.message}})
        default:
            console.log(err);
            res.status(500).json({errors: {message: err.message}})
            break;
    }
}

module.exports = errorHandler