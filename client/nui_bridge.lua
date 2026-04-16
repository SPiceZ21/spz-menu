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
