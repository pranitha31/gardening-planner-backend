import supabase from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

// ✅ Create Seasonal Plant with Image
export const createSeasonalPlant = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plant_name, season, plant_type } = req.body;
    const care_tips = req.body.care_tips ? JSON.parse(req.body.care_tips) : [];
    //console.log("BODY:", req.body);
    //console.log("FILE:", req.file);

    let imageUrl = null;

    // If image uploaded
    if (req.file) {
      const fileName = `${userId}-${uuidv4()}`;

      const { error: uploadError } = await supabase.storage
        .from("seasonal-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("seasonal-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { data, error } = await supabase
      .from("seasonal_planner")
      .insert([
        {
          user_id: userId,
          plant_name,
          season,
          plant_type,
          care_tips,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Seasonal plant created successfully",
      plant: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Create seasonal plant failed",
      error: err.message,
    });
  }
};

// ✅ Get All Seasonal Plants (for logged user)
export const getSeasonalPlants = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("seasonal_planner")
      .select("*")
      .eq("user_id", req.user.id)
      .order("season");

    if (error) throw error;

    res.json({
      count: data.length,
      plants: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Fetch seasonal plants failed",
      error: err.message,
    });
  }
};

// ✅ Get Single Seasonal Plant
export const getSeasonalPlantById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("seasonal_planner")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Seasonal plant not found" });
  }
};

// ✅ Update Seasonal Plant
export const updateSeasonalPlant = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1️⃣ Get existing seasonal plant
    const { data: existingPlant, error: fetchError } = await supabase
      .from("seasonal_planner")
      .select("image_url")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;

    let updatedData = { ...req.body };
    if (updatedData.care_tips) {
      updatedData.care_tips = JSON.parse(updatedData.care_tips);
    }

    // 2️⃣ If new image uploaded
    if (req.file) {
      if (existingPlant.image_url) {
        const oldFileName = existingPlant.image_url.split("/").pop();
        await supabase.storage.from("seasonal-images").remove([oldFileName]);
      }

      const fileName = `${userId}-${uuidv4()}`;
      const { error: uploadError } = await supabase.storage
        .from("seasonal-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("seasonal-images")
        .getPublicUrl(fileName);

      updatedData.image_url = data.publicUrl;
    }

    // 3️⃣ Update database
    const { data, error } = await supabase
      .from("seasonal_planner")
      .update(updatedData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Seasonal plant updated successfully",
      plant: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Update seasonal plant failed",
      error: err.message,
    });
  }
};

// ✅ Delete Seasonal Plant
export const deleteSeasonalPlant = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1️⃣ Get seasonal plant first
    const { data: plant, error: fetchError } = await supabase
      .from("seasonal_planner")
      .select("image_url")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;

    // 2️⃣ Delete image if exists
    if (plant.image_url) {
      const fileName = plant.image_url.split("/").pop();
      await supabase.storage.from("seasonal-images").remove([fileName]);
    }

    // 3️⃣ Delete record
    const { error } = await supabase
      .from("seasonal_planner")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({
      message: "Seasonal plant and image deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Delete seasonal plant failed",
      error: err.message,
    });
  }
};
