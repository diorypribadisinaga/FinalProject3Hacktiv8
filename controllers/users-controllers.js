const { User } = require("./../models/index");
const { compare } = require("./../helpers/hash");
const { sign } = require("./../helpers/jwt");
const Convert = require("../helpers/rupiah");

class UsersController {
	static async signIn(req, res, next) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });

			if (!user) {
				throw { name: "UserNotFound" };
			} else if (!compare(password, user.password)) {
				throw { name: "WrongPassword" };
			}

			const token = sign({ user: { id: user.id, email: user.email, role: user.role } });
			res.status(200).json({ token: token });
		} catch (error) {
			next(error);
		}
	}

	static async signUp(req, res, next) {
		const { full_name, password, gender, email } = req.body;
		try {
			const checkUser = await User.findOne({ where: { email } })
			if (checkUser) throw { name: "email already exist" }
			const user = await User.create({ full_name, password, gender, email, balance: 0 });
			res.status(201).json({ user: { id: user.id, full_name: user.full_name, email: user.email, gender: user.gender, balance: user.balance, createdAt: user.createdAt } });
		} catch (error) {
			next(error);
		}
	}

	static async updateUser(req, res, next) {
		try {
			let { full_name, email } = req.body;
			const { id } = req.user;
			const user = await User.findOne(
				{ where: { id } }
			);

			if (!user) {
				throw { name: "ErrNotFound" }
			} else if (user.id !== id) {
				throw { name: "not allowed" }
			}

			if (user.email == email) throw { name: "email already exist" }

			const result = await User.update({
				full_name, email, updatedAt: new Date()
			}, { where: { id }, returning: true, hooks: false });

			result[1][0].balance = Convert(result[1][0].balance)

			res.json(result[1]);
		} catch (err) {
			next(err)
		}
	}

	static async deleteUser(req, res, next) {
		try {
			const { id } = req.user
			const user = await User.findOne(
				{ where: { id } }
			)
			if (!user) {
				throw { name: "ErrNotFound" }
			}
			if (id !== user.id) {
				throw { name: "not allowed" }
			}
			await User.destroy({ where: { id } })
			res.json({ message: "Your account has been successfully deleted" })
		} catch (err) {
			next(err)
		}
	}

	static async topUp(req, res, next) {
		try {
			let { balance } = req.body;
			const { id } = req.user;
			const user = await User.findOne(
				{ where: { id } }
			);

			if (!user) {
				throw { name: "ErrNotFound" }
			} else if (user.id !== id) {
				throw { name: "not allowed" }
			}

			const result = await User.update({
				balance: user.balance + balance
			}, { where: { id }, returning: true, hooks: false });

			result[1][0].balance = Convert(result[1][0].balance)

			res.json(result[1]);
		} catch (err) {
			next(err)
		}
	}
}

module.exports = UsersController;
