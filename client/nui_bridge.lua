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

RegisterNUICallback("getQueueInfo", function(data, cb)
  local playerState = SPZ_STATE and SPZ_STATE.State or "FREEROAM"
  cb({
    state           = playerState == "QUEUED" and "queued" or playerState == "RACING" and "racing" or "idle",
    pollOpen        = false,
    queueCount      = 0,
    trackType       = "",
    playersCount    = 0,
    pollTimeLeft    = "",
    lastPosition    = "",
    ptsGained       = 0,
    refreshInterval = Config.QueueRefreshInterval or 5000,
  })
end)
