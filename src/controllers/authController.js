import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //console.log("REGISTER API HIT FROM FRONTEND");

    // ✅ basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // ✅ check existing email
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email);

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ insert user
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // ✅ REMOVE PASSWORD
    const { password: _, ...safeUser } = data;

    // ✅ GENERATE TOKEN (THIS IS WHAT WAS MISSING)
    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // ✅ RETURN TOKEN + USER
    res.status(201).json({
      message: "User registered successfully ✅",
      token,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const login = async (req, res) => {
  //console.log("LOGIN API HIT");
  //console.log("JWT SECRET:", process.env.JWT_SECRET);
  try {
    const { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    // ✅ find user
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // ✅ compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // ✅ TOKEN GENERATION
    //console.log("LOGIN SECRET:", process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    //console.log("TOKEN CREATED:", token);

    const { password: _, ...safeUser } = user;
    //onsole.log("SENDING RESPONSE NOW");
    return res.json({
      message: "Login successful ✅",
      token,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
