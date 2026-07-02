#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include "ApiClient.h"

class SplitSheetStudioProcessor final : public juce::AudioProcessor
{
public:
    SplitSheetStudioProcessor();
    ~SplitSheetStudioProcessor() override = default;

    const juce::String getName() const override;
    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    bool isBusesLayoutSupported(const BusesLayout& layouts) const override;
    void processBlock(juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    const juce::String getInputChannelName(int channelIndex) const override;
    const juce::String getOutputChannelName(int channelIndex) const override;
    bool isInputChannelStereoPair(int index) const override;
    bool isOutputChannelStereoPair(int index) const override;

    bool acceptsMidi() const override;
    bool producesMidi() const override;
    bool isMidiEffect() const override;
    double getTailLengthSeconds() const override;

    int getNumPrograms() override;
    int getCurrentProgram() override;
    void setCurrentProgram(int index) override;
    const juce::String getProgramName(int index) override;
    void changeProgramName(int index, const juce::String& newName) override;

    void getStateInformation(juce::MemoryBlock& destData) override;
    void setStateInformation(const void* data, int sizeInBytes) override;

    SplitSheetApiClient& getApiClient();

    juce::String getStatusText() const;
    void setStatusText(juce::String newStatus);

    juce::String getUserEmail() const;
    void setUserEmail(juce::String newUserEmail);

    juce::String getDisplayName() const;
    void setDisplayName(juce::String newDisplayName);

    juce::String getAccessToken() const;
    void setAccessToken(juce::String newToken);

    juce::String getRefreshToken() const;
    void setRefreshToken(juce::String newToken);

    bool hasSession() const;
    void clearSession();

private:
    SplitSheetApiClient apiClient;
    juce::String statusText { "Ready" };
    juce::String userEmail;
    juce::String displayName;
    juce::String accessToken;
    juce::String refreshToken;
    juce::CriticalSection stateLock;
};
