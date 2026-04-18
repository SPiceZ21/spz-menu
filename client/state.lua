SPZ_STATE = {}
SPZ_STATE.State = "FREEROAM" -- FREEROAM | QUEUED | RACING

-- ── Server → client events must be whitelisted with RegisterNetEvent ──────────
-- Without this, FiveM's security model silently drops incoming network events.

RegisterNetEvent("SPZ:stateChanged")
AddEventHandler("SPZ:stateChanged", function(newState)
  SPZ_STATE.State = newState
  SendNUIMessage({
    type    = "SPZ_UPDATE_STATE",
    payload = { state = newState },
  })
end)

-- Race state broadcasts arrive as "spz_race:state_updated" from state_machine.lua
RegisterNetEvent("spz_race:state_updated")
AddEventHandler("spz_race:state_updated", function(newState)
  SendNUIMessage({
    type    = "SPZ_POLL_STATUS",
    payload = { isOpen = (newState == "POLLING"), raceState = newState },
  })
end)

RegisterNetEvent("SPZ:identityReady")
AddEventHandler("SPZ:identityReady", function()
  TriggerServerEvent("SPZ:requestVehicleList")
end)

RegisterNetEvent("SPZ:vehicleListReady")
AddEventHandler("SPZ:vehicleListReady", function(classList)
  SendNUIMessage({
    type    = "SPZ:openSpawner",
    payload = { classes = classList },
  })
end)

-- Live queue count pushed from server whenever someone joins or leaves
RegisterNetEvent("SPZ:queueUpdated")
AddEventHandler("SPZ:queueUpdated", function(data)
  local widgetState = "idle"
  if SPZ_STATE.State == "QUEUED" then widgetState = "queued" end
  SendNUIMessage({
    type    = "SPZ_QUEUE_INIT",
    payload = {
      state      = widgetState,
      queueCount = data.count or 0,
      trackType  = data.raceType or "",
      pollOpen   = data.raceState == "POLLING",
    },
  })
end)

RegisterNetEvent("SPZ:rankChanged")
AddEventHandler("SPZ:rankChanged", function(data)
  SendNUIMessage({
    type    = "notify",
    payload = { type = "rankup", title = data.title, message = data.message },
  })
end)

RegisterNetEvent("SPZ:licenseUnlocked")
AddEventHandler("SPZ:licenseUnlocked", function(data)
  SendNUIMessage({
    type    = "notify",
    payload = { type = "unlock", title = data.title, classTag = data.classTag },
  })
end)

RegisterNetEvent("SPZ:crewChanged")
AddEventHandler("SPZ:crewChanged", function(data)
  SendNUIMessage({ type = "crewManagement", payload = data })
end)
