RegisterNUICallback("joinQueue", function(data, cb)
  TriggerServerEvent("SPZ:joinQueue")
  if cb then cb("ok") end
end)

RegisterNUICallback("leaveQueue", function(data, cb)
  TriggerServerEvent("SPZ:leaveQueue")
  if cb then cb("ok") end
end)

RegisterNUICallback("spawnVehicle", function(data, cb)
  TriggerServerEvent("SPZ:freeroamSpawn", data.model)
  if cb then cb("ok") end
end)

RegisterNUICallback("triggerSpawn", function(data, cb)
  TriggerServerEvent("SPZ:freeroamSpawn", data.model)
  if cb then cb("ok") end
end)

RegisterNUICallback("createCrew", function(data, cb)
  TriggerServerEvent("SPZ:createCrew", data.name, data.tag)
  if cb then cb("ok") end
end)

RegisterNUICallback("joinCrew", function(data, cb)
  TriggerServerEvent("SPZ:joinCrew", data.crewId)
  if cb then cb("ok") end
end)

RegisterNUICallback("leaveCrew", function(data, cb)
  TriggerServerEvent("SPZ:leaveCrew")
  if cb then cb("ok") end
end)

RegisterNUICallback("closeAll", function(data, cb)
  SetNuiFocus(false, false)
  if cb then cb("ok") end
end)

-- Cached queue state pushed from server via SPZ:queueUpdated
local _cachedQueue = { count = 0, raceType = "", raceState = "IDLE" }

RegisterNetEvent("SPZ:queueUpdated_cache", function(data)
  _cachedQueue = data
end)

AddEventHandler("SPZ:queueUpdated", function(data)
  _cachedQueue = data
end)

RegisterNUICallback("getQueueInfo", function(data, cb)
  local playerState = SPZ_STATE and SPZ_STATE.State or "FREEROAM"
  local widgetState = playerState == "QUEUED" and "queued"
                   or playerState == "RACING"  and "racing"
                   or "idle"
  cb({
    state           = widgetState,
    pollOpen        = _cachedQueue.raceState == "POLLING",
    queueCount      = _cachedQueue.count or 0,
    trackType       = _cachedQueue.raceType or "",
    playersCount    = _cachedQueue.count or 0,
    pollTimeLeft    = "",
    lastPosition    = "",
    ptsGained       = 0,
    refreshInterval = Config.QueueRefreshInterval or 5000,
  })
end)
