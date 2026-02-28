import { supabase } from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

// ✅ Create Plant with Image
export const createPlant = async (req, res) => {
  try {
    //console.log("BODY:", req.body);
    //console.log("FILE:", req.file);
    const userId = req.user.id;

    const { plant_name, plant_type, sunlight, watering_interval_days } =
      req.body;
    let imageUrl = null;

    // If image uploaded
    if (req.file) {
      const fileName = `${userId}-${uuidv4()}`;

      const { error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("plant-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { data, error } = await supabase
      .from("plants")
      .insert([
        {
          user_id: userId,
          plant_name,
          plant_type,
          sunlight,
          watering_interval_days: watering_interval_days || 3, // fallback default
          last_watered: new Date(),
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    // Auto-create watering reminder
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + Number(plant.watering_interval_days));
    await supabase
      .from("reminders")
      .insert([
        {
          user_id: userId,
          plant_id: plant.id,
          reminder_type: "Watering",
          reminder_date: nextDate,
          status: "pending",
        },
      ]);
    res.json({ plant });

    res.status(201).json({
      message: "Plant created successfully",
      plant: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Create plant failed",
      error: err.message,
    });
  }
};

// ✅ Get All Plants (for logged user)
export const getPlants = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.json({
      count: data.length,
      plants: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Fetch plants failed",
      error: err.message,
    });
  }
};
// ✅ Get Single Plant
export const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Plant not found" });
  }
};

export const updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1️⃣ Get existing plant
    const { data: existingPlant, error: fetchError } = await supabase
      .from("plants")
      .select("image_url")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;

    let updatedData = { ...req.body };

    // 2️⃣ If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (existingPlant.image_url) {
        const oldFileName = existingPlant.image_url.split("/").pop();

        const { error: removeError } = await supabase.storage
          .from("plant-images")
          .remove([oldFileName]);

        if (removeError) throw removeError;
      }

      // Upload new image
      const fileName = `${userId}-${uuidv4()}`;

      const { error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("plant-images")
        .getPublicUrl(fileName);

      updatedData.image_url = data.publicUrl;
    }

    // 3️⃣ Update database
    const { data, error } = await supabase
      .from("plants")
      .update(updatedData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Plant updated successfully",
      plant: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Update failed",
      error: err.message,
    });
  }
};
// ✅ Delete Plant
export const deletePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1️⃣ Get plant first
    const { data: plant, error: fetchError } = await supabase
      .from("plants")
      .select("image_url")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;

    // 2️⃣ If image exists → delete from storage
    if (plant.image_url) {
      const fileName = plant.image_url.split("/").pop();

      const { error: storageError } = await supabase.storage
        .from("plant-images")
        .remove([fileName]);

      if (storageError) throw storageError;
    }

    // 3️⃣ Delete plant from DB
    const { error } = await supabase
      .from("plants")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({
      message: "Plant and image deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Delete failed",
      error: err.message,
    });
  }
};
