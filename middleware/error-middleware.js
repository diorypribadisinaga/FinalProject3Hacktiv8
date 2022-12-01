function errorMiddleware(err, req, res, next) {
	let code;
	let message;

	if (err.name === "JsonWebTokenError") {
		code = 401;
		message = "Invalid token";
	} else if (err.name === "InvalidToken") {
		code = 401;
		message = "Invalid token";
	} else if (err.name === "Unauthorized" || err.name === "NoAuthorization") {
		code = 401;
		message = "Unauthorized";
	} else if (err.name === "ErrNotFound") {
		code = 404;
		message = "Data not found";
	} else if (err.name === "SequelizeValidationError") {
		code = 400;
		message = err.errors.map((err) => {
			return err.message;
		});
	} else if (err.name === "SequelizeForeignKeyConstraintError") {
		code = 400;
		message = "User does not exists";
	} else if (err.name === "UserNotFound" || err.name === "WrongPassword") {
		code = 401;
		message = "Email/Password is wrong";
	} else if (err.name === "SequelizeUniqueConstraintError") {
		code = 400;
		message = "Bad request";
	} else if (err.name === "not allowed") {
		code = 403
		message = "Anda Tidak Diijinkan!!"
	} else if (err.name === "category not found") {
		code = 404;
		message = "CategoryId does not exist";
	} else if (err.name === "Not Found Product") {
		code = 404;
		message = "Not Found Product"
	} else if (err.name === "out of stock") {
		code = 403
		message = "out of stock"
	} else if (err.name === "Your money is not enough") {
		code = 403
		message = "Your money is not enough"
	} else if (err.name === "email already exist") {
		code = 403
		message = "email already exist"
	} else if (err.name === "minimal 5 stock") {
		code = 403
		message = "minimal 5 stock"
	}
	else {
		code = 500;
		message = "Internal server error";
	}

	return res.status(code).json({ message });
}

module.exports = errorMiddleware;
