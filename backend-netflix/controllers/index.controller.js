const { ERR, OK } = require("../utils/response");
const { User } = require("../models/index.model");
const argon2 = require("argon2");

async function GetFavoriteMovies(req, res) {
  return OK(res, 200, req.user, "Success get favorite movies");
}

async function AddFavoriteMovies(req, res) {
  try {
    const { data } = req.body;
    const user = await User.findById(req.user._id);
    user.favoriteMovies.push(data);
    await user.save();
    return OK(res, 201, user.favoriteMovies, "Success add favorite movies");
  } catch (error) {
    return ERR(res, 500, "Error add favorite movies");
  }
}

async function RemoveFavoriteMovies(req, res) {
  try {
    const { movieID } = req.body;
    const user = await User.findById(req.user._id);

    const existingMovie = user.favoriteMovies.some(
      (movie) => movie.id === movieID
    );

    if (!existingMovie) {
      return ERR(res, 404, "Movie ID not found");
    }

    user.favoriteMovies = user.favoriteMovies.filter(
      (movie) => movie.id !== movieID
    );

    await user.save();
    return OK(res, 204, null, "Success remove favorite movies");
  } catch (error) {
    return ERR(res, 500, "Error remove favorite movies");
  }
}

async function CheckFavoriteMovies(req, res) {
  const { movieID } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isFavorited = await user.favoriteMovies.some(
      (movie) => movie.id === movieID
    );

    return OK(res, 200, { isFavorited }, "Success check favorite movies");
  } catch (error) {
    return ERR(res, 500, "Error check favorite movies");
  }
}

async function SignInToken(req, res) {
  try {
    const { email, password, token } = req.body;
    let user = await User.findOne({ email });
    if (!user) return ERR(res, 400, "Email not found");

    const isPasswordOk = await argon2.verify(user.password, password);

    if (!isPasswordOk) return ERR(res, 400, "Password not match");

    user.token = token;

    await user.save();
    return OK(res, 200, null, "Sign In Token Saved");
  } catch (error) {
    console.log(error);
    return ERR(res, 500, "Error sign in token");
  }
}

async function SignOutToken(req, res) {
  const user = await User.findById(req.user._id);
  user.token = null;
  await user.save();
  return OK(res, 204, null, "Sign Out Successfully");
}

async function SignUpUser(req, res) {
  const { email, password } = req.body;
  const hashPass = await argon2.hash(password);

  try {
    const user = await User.findOne({ email });
    if (user) return ERR(res, 400, "Email already exists");

    const addNewUser = new User({ email, password: hashPass });
    await addNewUser.save();
    return OK(res, 201, addNewUser._id, "Sign Up Successfully");
  } catch (error) {
    console.log("Error", error);
    return ERR(res, 500, "Signup Failed");
  }
}

module.exports = {
  GetFavoriteMovies,
  AddFavoriteMovies,
  RemoveFavoriteMovies,
  CheckFavoriteMovies,
  SignInToken,
  SignOutToken,
  SignUpUser,
};
