if not Config then Config = { Keys = { Spawner = "F2", Leaderboard = "F3", Profile = "F4", Crew = "F5" } } end
SPZ_STATE = SPZ_STATE or { State = "FREEROAM" } -- "FREEROAM", "QUEUED", "RACING"

-- Queue join/leave — Lua-side so it works under SetNuiFocus(true, false)
RegisterKeyMapping("spz_queue", "SPiceZ: Join / Leave Queue", "keyboard", "e")
RegisterCommand("spz_queue", function()
    local state = SPZ_STATE.State
    if state == "FREEROAM" then
        TriggerServerEvent("SPZ:joinQueue")
    elseif state == "QUEUED" then
        TriggerServerEvent("SPZ:leaveQueue")
    end
end, false)

RegisterKeyMapping("spz_spawner", "SPiceZ: Vehicle spawner", "keyboard", Config.Keys.Spawner)
RegisterCommand("spz_spawner", function()
  if SPZ_STATE.State == "FREEROAM" then
    TriggerEvent("SPZ:openSpawner")
  end
end, false)

RegisterKeyMapping("spz_leaderboard", "SPiceZ: Leaderboard", "keyboard", Config.Keys.Leaderboard)
RegisterCommand("spz_leaderboard", function()
  if SPZ_STATE.State ~= "RACING" then
    SendNUIMessage({ type = "OPEN_MENU", data = { name = "leaderboard" } })
    SetNuiFocus(true, true)
  end
end, false)

RegisterKeyMapping("spz_profile", "SPiceZ: Profile", "keyboard", Config.Keys.Profile)
RegisterCommand("spz_profile", function()
  if SPZ_STATE.State ~= "RACING" then
    SendNUIMessage({ type = "OPEN_MENU", data = { name = "profile" } })
    SetNuiFocus(true, true)
  end
end, false)

RegisterKeyMapping("spz_crew", "SPiceZ: Crew", "keyboard", Config.Keys.Crew)
RegisterCommand("spz_crew", function()
  if SPZ_STATE.State ~= "RACING" and SPZ_STATE.State ~= "QUEUED" then
    SendNUIMessage({ type = "OPEN_MENU", data = { name = "crewManagement" } })
    SetNuiFocus(true, true)
  end
end, false)

-- Example state export/event handling stub
AddEventHandler("SPZ:updateState", function(newState)
    SPZ_STATE.State = newState
end)
