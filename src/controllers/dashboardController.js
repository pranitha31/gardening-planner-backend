import supabase from "../config/supabaseClient.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // PLANTS COUNT
    const { count: plantCount } = await supabase
      .from("plants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // REMINDERS PENDING
    const { count: pendingCount } = await supabase
      .from("reminders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "pending");

    // REMINDERS COMPLETED
    const { count: completedCount } = await supabase
      .from("reminders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed");

    // SEASONAL PLANNER COUNT
    const { count: seasonalPlannerCount } = await supabase
      .from("seasonal_planner")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    const { count: seasonalTaskCount } = await supabase
      .from("seasonal_tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    const today = new Date().toISOString().split("T")[0];

    // TodayReminder status
    const { data: todayReminders } = await supabase
      .from("reminders")
      .select("*, plants(plant_name)")
      .eq("user_id", userId)
      .eq("reminder_date", today)
      .eq("status", "pending");


    // Upcoming reminders
    const { data: upcomingReminders } = await supabase
      .from("reminders")
      .select("*, plants(plant_name)")
      .eq("user_id", userId)
      .gt("reminder_date", today)
      .eq("status", "pending")
      .order("reminder_date", { ascending: true })
      .limit(5);

    const { data: userData } = await supabase
      .from("users")
      .select("country, state, city")
      .eq("id", userId)
      .single();

    const locationMissing =
      !userData?.country || !userData?.state || !userData?.city;

    res.json({
      plants: plantCount || 0,
      reminders_pending: pendingCount || 0,
      reminders_completed: completedCount || 0,
      seasonal_planner: seasonalPlannerCount || 0,
      seasonal_tasks: seasonalTaskCount || 0,
      today_reminders: todayReminders || [],
      upcoming_reminders: upcomingReminders || [],
      locationMissing,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
