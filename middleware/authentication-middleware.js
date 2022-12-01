const { verify } = require("./../helpers/jwt");
const { User } = require("./../models/index");

async function authenticationMiddleware(req, res, next) {
	try {
		const { authorization } = req.headers;
		if (!authorization) throw { name: 'NoAuthorization' };

		const token = authorization.split("Bearer ");
		if (token.length !== 2) throw { name: "InvalidToken" };

		const { id, email, role } = verify(token[1]).user;

		const user = await User.findOne({ where: { id, email, role } });
		if (!user) throw { name: "Unauthorized" };

		req.user = { id, email, role };
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = authenticationMiddleware;
