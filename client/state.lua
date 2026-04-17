SPZ_STATE = {}
SPZ_STATE.State = "FREEROAM" -- FREEROAM | QUEUED | RACING

AddEventHandler("SPZ:stateChanged", function(newState)
  SPZ_STATE.State = newState
  SendNUIMessage({
    type = "SPZ_UPDATE_STATE",
    payload = { state = newState }
  })
end)

AddEventHandler("SPZ:raceStateChanged", function(stateData)
  SendNUIMessage({
    type = "SPZ_POLL_STATUS",
    payload = { isOpen = stateData.pollOpen }
  })
end)

AddEventHandler("SPZ:identityReady", function()
  TriggerServerEvent("SPZ:requestVehicleList")
end)

RegisterNetEvent("SPZ:vehicleListReady", function(classList)
  SendNUIMessage({
    type = "SPZ:openSpawner",
    payload = { classes = classList }
  })
end)

-- Live queue count pushed from server whenever someone joins or leaves
RegisterNetEvent("SPZ:queueUpdated", function(data)
  local widgetState = "idle"
  if SPZ_STATE.State == "QUEUED" then widgetState = "queued" end
  SendNUIMessage({
    type = "SPZ_QUEUE_INIT",
    payload = {
      state      = widgetState,
      queueCount = data.count or 0,
      trackType  = data.raceType or "",
      pollOpen   = data.raceState == "POLLING",
    }
  })
end)

AddEventHandler("SPZ:rankChanged", function(data)
  SendNUIMessage({
    type = "notify",
    payload = { type = "rankup", title = data.title, message = data.message }
  })
end)

AddEventHandler("SPZ:licenseUnlocked", function(data)
  SendNUIMessage({
    type = "notify",
    payload = { type = "unlock", title = data.title, classTag = data.classTag }
  })
end)

AddEventHandler("SPZ:crewChanged", function(data)
  SendNUIMessage({ type = "crewManagement", payload = data })
end)
