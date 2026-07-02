#include "PluginProcessor.h"
#include "PluginEditor.h"

SplitSheetStudioProcessor::SplitSheetStudioProcessor()
    : juce::AudioProcessor(BusesProperties().withInput("Input", juce::AudioChannelSet::stereo(), true)
                                             .withOutput("Output", juce::AudioChannelSet::stereo(), true))
{
}

const juce::String SplitSheetStudioProcessor::getName() const { return "SplitSheet Studio"; }
void SplitSheetStudioProcessor::prepareToPlay(double, int) {}
void SplitSheetStudioProcessor::releaseResources() {}

bool SplitSheetStudioProcessor::isBusesLayoutSupported(const BusesLayout& layouts) const
{
    return layouts.getMainInputChannelSet() == layouts.getMainOutputChannelSet();
}

void SplitSheetStudioProcessor::processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer&)
{
    juce::ScopedNoDenormals noDenormals;
    for (int channel = 0; channel < getTotalNumOutputChannels(); ++channel)
    {
        if (channel >= getTotalNumInputChannels())
            buffer.clear(channel, 0, buffer.getNumSamples());
    }
}

juce::AudioProcessorEditor* SplitSheetStudioProcessor::createEditor() { return new SplitSheetStudioEditor(*this); }
bool SplitSheetStudioProcessor::hasEditor() const { return true; }
const juce::String SplitSheetStudioProcessor::getInputChannelName(int channelIndex) const { return juce::String(channelIndex + 1); }
const juce::String SplitSheetStudioProcessor::getOutputChannelName(int channelIndex) const { return juce::String(channelIndex + 1); }
bool SplitSheetStudioProcessor::isInputChannelStereoPair(int) const { return true; }
bool SplitSheetStudioProcessor::isOutputChannelStereoPair(int) const { return true; }
bool SplitSheetStudioProcessor::acceptsMidi() const { return false; }
bool SplitSheetStudioProcessor::producesMidi() const { return false; }
bool SplitSheetStudioProcessor::isMidiEffect() const { return false; }
double SplitSheetStudioProcessor::getTailLengthSeconds() const { return 0.0; }
int SplitSheetStudioProcessor::getNumPrograms() { return 1; }
int SplitSheetStudioProcessor::getCurrentProgram() { return 0; }
void SplitSheetStudioProcessor::setCurrentProgram(int) {}
const juce::String SplitSheetStudioProcessor::getProgramName(int) { return {}; }
void SplitSheetStudioProcessor::changeProgramName(int, const juce::String&) {}

void SplitSheetStudioProcessor::getStateInformation(juce::MemoryBlock& destData)
{
    juce::ValueTree state("SplitSheetStudioState");
    {
        const juce::ScopedLock lock(stateLock);
        state.setProperty("baseUrl", apiClient.getBaseUrl(), nullptr);
        state.setProperty("statusText", statusText, nullptr);
        state.setProperty("userEmail", userEmail, nullptr);
        state.setProperty("displayName", displayName, nullptr);
        state.setProperty("accessToken", accessToken, nullptr);
        state.setProperty("refreshToken", refreshToken, nullptr);
    }

    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    copyXmlToBinary(*xml, destData);
}

void SplitSheetStudioProcessor::setStateInformation(const void* data, int sizeInBytes)
{
    std::unique_ptr<juce::XmlElement> xml(getXmlFromBinary(data, sizeInBytes));
    if (xml == nullptr)
        return;

    juce::ValueTree state = juce::ValueTree::fromXml(*xml);
    if (!state.isValid())
        return;

    const juce::ScopedLock lock(stateLock);
    apiClient.setBaseUrl(state["baseUrl"].toString());
    statusText = state["statusText"].toString();
    userEmail = state["userEmail"].toString();
    displayName = state["displayName"].toString();
    accessToken = state["accessToken"].toString();
    refreshToken = state["refreshToken"].toString();
}

SplitSheetApiClient& SplitSheetStudioProcessor::getApiClient() { return apiClient; }

juce::String SplitSheetStudioProcessor::getStatusText() const
{
    const juce::ScopedLock lock(stateLock);
    return statusText;
}

void SplitSheetStudioProcessor::setStatusText(juce::String newStatus)
{
    const juce::ScopedLock lock(stateLock);
    statusText = std::move(newStatus);
}

juce::String SplitSheetStudioProcessor::getUserEmail() const
{
    const juce::ScopedLock lock(stateLock);
    return userEmail;
}

void SplitSheetStudioProcessor::setUserEmail(juce::String newUserEmail)
{
    const juce::ScopedLock lock(stateLock);
    userEmail = std::move(newUserEmail);
}

juce::String SplitSheetStudioProcessor::getDisplayName() const
{
    const juce::ScopedLock lock(stateLock);
    return displayName;
}

void SplitSheetStudioProcessor::setDisplayName(juce::String newDisplayName)
{
    const juce::ScopedLock lock(stateLock);
    displayName = std::move(newDisplayName);
}

juce::String SplitSheetStudioProcessor::getAccessToken() const
{
    const juce::ScopedLock lock(stateLock);
    return accessToken;
}

void SplitSheetStudioProcessor::setAccessToken(juce::String newToken)
{
    const juce::ScopedLock lock(stateLock);
    accessToken = std::move(newToken);
}

juce::String SplitSheetStudioProcessor::getRefreshToken() const
{
    const juce::ScopedLock lock(stateLock);
    return refreshToken;
}

void SplitSheetStudioProcessor::setRefreshToken(juce::String newToken)
{
    const juce::ScopedLock lock(stateLock);
    refreshToken = std::move(newToken);
}

bool SplitSheetStudioProcessor::hasSession() const
{
    const juce::ScopedLock lock(stateLock);
    return refreshToken.isNotEmpty() || accessToken.isNotEmpty();
}

void SplitSheetStudioProcessor::clearSession()
{
    const juce::ScopedLock lock(stateLock);
    userEmail.clear();
    displayName.clear();
    accessToken.clear();
    refreshToken.clear();
    statusText = "Ready";
}

juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new SplitSheetStudioProcessor();
}
