#include "ApiClient.h"
#include <thread>

namespace
{
    juce::String readStream(juce::InputStream& stream)
    {
        return stream.readEntireStreamAsString();
    }

    SplitSheetApiClient::LoginResponse parseLoginResponse(const juce::var& response)
    {
        SplitSheetApiClient::LoginResponse result;

        if (auto* object = response.getDynamicObject())
        {
            result.ok = object->getProperty("ok");
            result.accessToken = object->getProperty("accessToken").toString();
            result.refreshToken = object->getProperty("refreshToken").toString();

            if (auto userVar = object->getProperty("user"); userVar.isObject())
            {
                if (auto* userObject = userVar.getDynamicObject())
                {
                    result.userEmail = userObject->getProperty("email").toString();
                    result.displayName = userObject->getProperty("displayName").toString();
                }
            }

            result.errorMessage = object->getProperty("error").toString();
        }

        return result;
    }

    template <typename Callback>
    void runJsonPostRequest(juce::String endpoint,
                            juce::String requestBody,
                            juce::String extraHeaders,
                            Callback callback)
    {
        std::thread([endpoint = std::move(endpoint),
                     requestBody = std::move(requestBody),
                     extraHeaders = std::move(extraHeaders),
                     callback = std::move(callback)]() mutable
        {
            juce::var parsedResponse;
            juce::String fallbackError;

            try
            {
                auto stream = juce::URL(endpoint)
                                  .withPOSTData(requestBody)
                                  .createInputStream(juce::URL::InputStreamOptions(juce::URL::ParameterHandling::inAddress)
                                                         .withConnectionTimeoutMs(5000)
                                                         .withExtraHeaders(extraHeaders));

                if (stream != nullptr)
                    parsedResponse = juce::JSON::parse(readStream(*stream));
                else
                    fallbackError = "Request failed";
            }
            catch (...)
            {
                fallbackError = "Request failed";
            }

            juce::MessageManager::callAsync([callback = std::move(callback),
                                             parsedResponse,
                                             fallbackError]() mutable
            {
                callback(parsedResponse, fallbackError);
            });
        }).detach();
    }
}

void SplitSheetApiClient::setBaseUrl(juce::String newBaseUrl)
{
    baseUrl = trimTrailingSlash(newBaseUrl.trim());
}

juce::String SplitSheetApiClient::getBaseUrl() const
{
    return baseUrl;
}

void SplitSheetApiClient::fetchReady(ReadyCallback callback) const
{
    const auto endpoint = baseUrl + "/api/ready";

    std::thread([endpoint, callback = std::move(callback)]() mutable
    {
        ReadyResponse result;

        try
        {
            juce::URL url(endpoint);
            auto stream = url.createInputStream(juce::URL::InputStreamOptions(juce::URL::ParameterHandling::inAddress)
                                                    .withConnectionTimeoutMs(5000));

            if (stream != nullptr)
            {
                const auto payload = juce::JSON::parse(readStream(*stream));
                if (auto* object = payload.getDynamicObject())
                {
                    result.ok = object->getProperty("ok");
                    result.baseUrl = object->getProperty("baseUrl").toString();
                    result.dbProvider = object->getProperty("dbProvider").toString();
                }
            }
        }
        catch (...) {}

        dispatchToMessageThread([callback = std::move(callback), result]() mutable
        {
            callback(result);
        });
    }).detach();
}

void SplitSheetApiClient::login(juce::String email, juce::String password, LoginCallback callback) const
{
    const auto endpoint = baseUrl + "/api/auth/login";
    juce::DynamicObject::Ptr bodyObject = new juce::DynamicObject();
    bodyObject->setProperty("email", email);
    bodyObject->setProperty("password", password);

    runJsonPostRequest(endpoint,
                       juce::JSON::toString(juce::var(bodyObject.get())),
                       "Content-Type: application/json\r\n",
                       [callback = std::move(callback)](juce::var response, juce::String fallbackError) mutable
                       {
                           auto result = parseLoginResponse(response);
                           if (!result.ok && result.errorMessage.isEmpty())
                               result.errorMessage = fallbackError.isNotEmpty() ? fallbackError : "Sign in failed";
                           callback(result);
                       });
}

void SplitSheetApiClient::refreshSession(juce::String refreshToken, LoginCallback callback) const
{
    const auto endpoint = baseUrl + "/api/auth/refresh";
    juce::DynamicObject::Ptr bodyObject = new juce::DynamicObject();
    bodyObject->setProperty("refreshToken", refreshToken);

    runJsonPostRequest(endpoint,
                       juce::JSON::toString(juce::var(bodyObject.get())),
                       "Content-Type: application/json\r\n",
                       [callback = std::move(callback)](juce::var response, juce::String fallbackError) mutable
                       {
                           auto result = parseLoginResponse(response);
                           if (!result.ok && result.errorMessage.isEmpty())
                               result.errorMessage = fallbackError.isNotEmpty() ? fallbackError : "Session restore failed";
                           callback(result);
                       });
}

void SplitSheetApiClient::logout(juce::String refreshToken, std::function<void()> callback) const
{
    const auto endpoint = baseUrl + "/api/auth/logout";
    juce::DynamicObject::Ptr bodyObject = new juce::DynamicObject();
    bodyObject->setProperty("refreshToken", refreshToken);

    runJsonPostRequest(endpoint,
                       juce::JSON::toString(juce::var(bodyObject.get())),
                       "Content-Type: application/json\r\n",
                       [callback = std::move(callback)](juce::var, juce::String) mutable
                       {
                           callback();
                       });
}

void SplitSheetApiClient::createSplitSheet(juce::String accessToken, juce::var payload, SplitSheetCallback callback) const
{
    const auto endpoint = baseUrl + "/api/split-sheets";
    const auto requestBody = juce::JSON::toString(payload);
    const auto headers = "Content-Type: application/json\r\nAuthorization: Bearer " + accessToken + "\r\n";

    runJsonPostRequest(endpoint,
                       requestBody,
                       headers,
                       [callback = std::move(callback)](juce::var response, juce::String fallbackError) mutable
                       {
                           SplitSheetResponse result;
                           if (auto* object = response.getDynamicObject())
                           {
                               result.ok = object->getProperty("ok");
                               result.errorMessage = object->getProperty("error").toString();

                               if (auto splitSheetVar = object->getProperty("splitSheet"); splitSheetVar.isObject())
                               {
                                   if (auto* splitSheetObject = splitSheetVar.getDynamicObject())
                                   {
                                       result.splitSheetId = splitSheetObject->getProperty("id").toString();
                                       result.songTitle = splitSheetObject->getProperty("songTitle").toString();
                                       result.status = splitSheetObject->getProperty("status").toString();
                                   }
                               }
                           }

                           if (!result.ok && result.errorMessage.isEmpty())
                               result.errorMessage = fallbackError.isNotEmpty() ? fallbackError : "Save failed";

                           callback(result);
                       });
}

juce::String SplitSheetApiClient::trimTrailingSlash(juce::String value)
{
    while (value.endsWithChar('/'))
        value = value.dropLastCharacters(1);

    return value;
}

void SplitSheetApiClient::dispatchToMessageThread(std::function<void()> fn)
{
    juce::MessageManager::callAsync([fn = std::move(fn)]() mutable
    {
        fn();
    });
}
