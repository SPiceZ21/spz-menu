RegisterNetEvent("SPZ:requestVehicleList", function()
    local src = source
    local classList = exports["spz-vehicles"]:GetFreeroamVehicles(src)
    TriggerClientEvent("SPZ:vehicleListReady", src, classList)
end)

local function GetPlatformName(source)
  local name = GetPlayerName(source)
  if not name then return "racer" end
  name = name:lower():gsub("%s+", "_"):gsub("[^a-z0-9_]", ""):sub(1, 20)
  return name ~= "" and name or "racer"
end

AddEventHandler("SPZ:firstTimePlayer", function(source)
  local suggested = GetPlatformName(source)
  TriggerClientEvent("SPZ:openCharacterCreation", source, { suggested = suggested })
end)
