if not SPZ then SPZ = {} end
if not SPZ.Menu then SPZ.Menu = {} end

-- Fallback locally if SPZ.Menu is not fully implemented yet
SPZ.Menu.Open = SPZ.Menu.Open or function(menuName, data)
  SendNUIMessage({
    type = "OPEN_MENU",
    data = {
      name = menuName,
      suggestedUsername = data.suggestedUsername
    }
  })
end

AddEventHandler("SPZ:openCharacterCreation", function(data)
  if SetPreviewPed then
    SetPreviewPed(0)
  end
  SetNuiFocus(true, true)
  SPZ.Menu.Open("characterCreation", { suggestedUsername = data.suggested })
end)

RegisterNUICallback("previewGender", function(data, cb)
  local genderModel = data.gender
  if SetPreviewPed then
      SetPreviewPed(genderModel)
  end
  cb("ok")
end)

RegisterNUICallback("createCharacter", function(data, cb)
  SetNuiFocus(false, false)
  TriggerServerEvent("SPZ:submitCharacter", data.username, data.gender)
  cb("ok")
end)
