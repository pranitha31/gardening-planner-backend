import supabase from "../config/supabaseClient.js";

export const createTask = async (req, res) => {
  try {
    const { seasonal_planner_id, task_type, description, start_date, end_date } = req.body;

    // 🔥 Get season from seasonal_planner
    const { data: plant, error: plantError } = await supabase
      .from("seasonal_planner")
      .select("season")
      .eq("id", seasonal_planner_id)
      .single();

    if (plantError) throw plantError;

    const task = {
      user_id: req.user.id,
      seasonal_planner_id,
      season: plant.season, // auto link season
      task_type,
      description,
      start_date,
      end_date, 
      status: "Pending"
    };

    const { data, error } = await supabase
      .from("seasonal_tasks")
      .insert([task])
      .select(`
        *,
        seasonal_planner (
          plant_name,
          image_url,
          season
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Seasonal task created",
      task: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getTasks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("seasonal_tasks")
      .select(`
        *,
        seasonal_planner (
          plant_name,
          image_url,
          season
        )
      `)
      .eq("user_id", req.user.id)
      .order("start_date", { ascending: true });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("seasonal_tasks")
      .update(req.body)
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Task updated", task: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("seasonal_tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.json({ message: "Task deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};