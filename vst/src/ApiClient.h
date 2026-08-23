#pragma once

#include <juce_gui_extra/juce_gui_extra.h>
#include <functional>

class SplitSheetApiClient
{
public:
    struct ReadyResponse
    {
        bool ok = false;
        juce::String baseUrl;
        juce::String dbProvider;
    };

    struct LoginResponse
    {
        bool ok = false;
        juce::String accessToken;
        juce::String refreshToken;
        juce::String userEmail;
        juce::String displayName;
        juce::String errorMessage;
    };

    struct SplitSheetResponse
    {
        bool ok = false;
        juce::String splitSheetId;
        juce::String songTitle;
        juce::String status;
        juce::String errorMessage;
    };

    struct PluginUpdateResponse
    {
        bool ok = false;
        bool updateAvailable = false;
        bool updateRequired = false;
        juce::String latestVersion;
        juce::String minimumSupportedVersion;
        juce::String downloadUrl;
        juce::String releaseNotesUrl;
        juce::String message;
        juce::String errorMessage;
    };

    using ReadyCallback = std::function<void (ReadyResponse)>;
    using LoginCallback = std::function<void (LoginResponse)>;
    using SplitSheetCallback = std::function<void (SplitSheetResponse)>;
    using PluginUpdateCallback = std::function<void (PluginUpdateResponse)>;

    void setBaseUrl(juce::String newBaseUrl);
    juce::String getBaseUrl() const;

    void fetchReady(ReadyCallback callback) const;
    void login(juce::String email, juce::String password, LoginCallback callback) const;
    void refreshSession(juce::String refreshToken, LoginCallback callback) const;
    void logout(juce::String refreshToken, std::function<void()> callback) const;
    void createSplitSheet(juce::String accessToken, juce::var payload, SplitSheetCallback callback) const;
    void fetchPluginUpdate(juce::String currentVersion, PluginUpdateCallback callback) const;

private:
    juce::String baseUrl { "https://app.splitsheetstudio.com" };

    static juce::String trimTrailingSlash(juce::String value);
    static void dispatchToMessageThread(std::function<void()> fn);
};
