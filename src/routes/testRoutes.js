import express from "express";
import { supabase } from "../config/supabaseClient.js";

const router = express.Router();

router.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .limit(1);

  if (error) return res.status(500).json(error);

  res.json(data);
});

export default router;
