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

SPZ.Menu.Close = SPZ.Menu.Close or function()
    SendNUIMessage({ type = "CLOSE_MENU" })
end

local previewPed = nil
local previewCam = nil

local function CleanupPreviewPed()
    if previewPed then
        DeleteEntity(previewPed)
        previewPed = nil
    end
    if previewCam then
        RenderScriptCams(false, false, 0, true, true)
        DestroyCam(previewCam, true)
        previewCam = nil
    end
end

local function EnsurePreviewPed(modelName)
    local model = GetHashKey(modelName)
    RequestModel(model)
    local timer = GetGameTimer()
    while not HasModelLoaded(model) do 
        Wait(0)
        if GetGameTimer() - timer > 5000 then return end
    end

    if previewPed then
        DeleteEntity(previewPed)
    end

    local coords = Config.CharacterPreview or {x=0.0, y=5.0, z=72.0}
    previewPed = CreatePed(4, model, coords.x, coords.y, coords.z, 180.0, false, false)
    
    SetEntityAlpha(previewPed, 255, false)
    SetEntityInvincible(previewPed, true)
    FreezeEntityPosition(previewPed, true)
    SetBlockingOfNonTemporaryEvents(previewPed, true)
    
    -- Cam logic
    if not previewCam then
        previewCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
        SetCamCoord(previewCam, coords.x, coords.y + 2.5, coords.z + 0.3)
        PointCamAtEntity(previewCam, previewPed, 0.0, 0.0, 0.0, true)
        SetCamActive(previewCam, true)
        RenderScriptCams(true, false, 0, true, true)
    else
        PointCamAtEntity(previewCam, previewPed, 0.0, 0.0, 0.0, true)
    end
end

RegisterNetEvent("SPZ:openCharacterCreation", function(data)
    EnsurePreviewPed("mp_m_freemode_01")
    SetNuiFocus(true, true)
    SPZ.Menu.Open("characterCreation", { suggestedUsername = data.suggested })
end)

RegisterNUICallback("previewGender", function(data, cb)
    local genderModel = "mp_m_freemode_01"
    if data.gender == "mp_f_freemode_01" or data.gender == "f" then
        genderModel = "mp_f_freemode_01"
    end
    
    EnsurePreviewPed(genderModel)
    cb("ok")
end)

RegisterNUICallback("createCharacter", function(data, cb)
    local genderNum = (data.gender == "mp_m_freemode_01" or data.gender == "m" or data.gender == 0) and 0 or 1
    TriggerServerEvent("SPZ:characterCreated", genderNum, data.username)
    cb("ok")
end)

RegisterNetEvent("SPZ:characterCreateCompleted", function(success, message)
    if success then
        SetNuiFocus(false, false)
        CleanupPreviewPed()
        SPZ.Menu.Close()
        if lib and lib.notify then
            lib.notify({ title = 'Welcome!', description = message, type = 'success' })
        end
    else
        if lib and lib.notify then
            lib.notify({ title = 'Character Creation Failed', description = message, type = 'error' })
        end
    end
end)

AddEventHandler("onResourceStop", function(res)
    if GetCurrentResourceName() == res then
        CleanupPreviewPed()
    end
end)
