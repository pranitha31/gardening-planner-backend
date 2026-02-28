import supabase from "../config/supabaseClient.js";

// CREATE REMINDER (keep as-is for non-watering reminders)
export const createReminder = async (req, res) => {
  try {
    const { plant_id, reminder_type, reminder_date } = req.body;

    const { data, error } = await supabase
      .from("reminders")
      .insert([
        {
          user_id: req.user.id,
          plant_id,
          reminder_type,
          reminder_date,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Reminder created",
      reminder: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER REMINDERS (keep as-is)
export const getReminders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reminders")
      .select(
        `
        *,
        plants (
          id,
          plant_name,
          image_url
        )
      `,
      )
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.json({ reminders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE REMINDER (keep for generic updates)
export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("reminders")
      .update(req.body)
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Reminder updated",
      reminder: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE REMINDER (keep as-is)
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("reminders")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NEW: COMPLETE REMINDER (Smart Auto Watering)
export const completeReminder = async (req, res) => {
  try {
    const { id } = req.params;

    // Get reminder with plant interval
    const { data: reminder, error: fetchError } = await supabase
      .from("reminders")
      .select("*, plants(watering_interval_days)")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();
    if (fetchError) throw fetchError;

    // Mark completed
    await supabase
      .from("reminders")
      .update({ status: "completed" })
      .eq("id", id);

    // If watering → auto schedule next
    if (reminder.reminder_type === "Watering") {
      const nextDate = new Date();
      nextDate.setDate(
        nextDate.getDate() + reminder.plants.watering_interval_days,
      );

      await supabase.from("reminders").insert([
        {
          user_id: reminder.user_id,
          plant_id: reminder.plant_id,
          reminder_type: "Watering",
          reminder_date: nextDate,
          status: "pending",
        },
      ]);

      // Update last_watered in plant
      await supabase
        .from("plants")
        .update({ last_watered: new Date() })
        .eq("id", reminder.plant_id);
    }

    res.json({ message: "Reminder completed & rescheduled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
