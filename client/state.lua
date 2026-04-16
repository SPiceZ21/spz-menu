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
  if Config.AutoOpenSpawner then
    SendNUIMessage({ type = "SPZ:openSpawner" })
  end
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
