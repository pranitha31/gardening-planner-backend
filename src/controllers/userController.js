import supabase from "../config/supabaseClient.js";

export const updateLocation = async (req, res) => {
  try {
    const { country, state, city } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!country || !state || !city) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { error } = await supabase
      .from("users")
      .update({ country, state, city })
      .eq("id", req.user.id);

    if (error) throw error;

    res.json({ message: "Location updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating location" });
  }
};
export const getMyLocation = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("country, state, city")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    if (!user || !user.city) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};