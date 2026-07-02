#pragma once

#include <juce_gui_extra/juce_gui_extra.h>
#include <memory>
#include <vector>
#include "PluginProcessor.h"

class SplitSheetStudioEditor final : public juce::AudioProcessorEditor,
                                     private juce::Button::Listener
{
public:
    explicit SplitSheetStudioEditor(SplitSheetStudioProcessor&);
    ~SplitSheetStudioEditor() override;

    void paint(juce::Graphics&) override;
    void resized() override;

private:
    enum class Step
    {
        song,
        contributors,
        review
    };

    class PaintedComponent;
    class SignaturePad;

    struct ContributorRow
    {
        std::unique_ptr<juce::Label> titleLabel;
        std::unique_ptr<juce::TextEditor> legalName;
        std::unique_ptr<juce::ComboBox> role;
        std::unique_ptr<juce::TextEditor> address;
        std::unique_ptr<juce::TextEditor> phone;
        std::unique_ptr<juce::TextEditor> email;
        std::unique_ptr<juce::TextEditor> pro;
        std::unique_ptr<juce::TextEditor> ipi;
        std::unique_ptr<juce::TextEditor> publisherName;
        std::unique_ptr<juce::TextEditor> publisherIpi;
        std::unique_ptr<juce::TextEditor> writerShare;
        std::unique_ptr<juce::TextEditor> publisherShare;
        std::unique_ptr<juce::TextEditor> typedSignatureName;
        std::unique_ptr<juce::Label> signatureLabel;
        std::unique_ptr<SignaturePad> signaturePad;
        std::unique_ptr<juce::TextButton> clearSignatureButton;
        std::unique_ptr<juce::TextButton> removeButton;
    };

    void buttonClicked(juce::Button*) override;

    void buildContributorRow();
    void removeContributorRow(int index);
    void refreshViewState();
    void restoreSessionIfNeeded();
    void runLogin();
    void runLogout();
    void submitSplitSheet();
    void updateStatus(juce::String message, juce::Colour colour);
    void setBusy(bool busy);
    void toggleSettings();
    void switchStep(Step step);
    void updateStepButtons();
    void updateContributorTitles();
    void refreshContributorCanvas();
    void refreshRecipientButtons();
    void refreshReviewSummary();
    void refreshSubmitState();
    void resetForm();
    juce::String validationMessage() const;
    juce::var buildSubmissionPayload() const;
    juce::StringArray collectRecipientEmails() const;
    double writerTotal() const;
    double publisherTotal() const;
    bool isAuthenticated() const;
    void populateSignedInDefaults();

    SplitSheetStudioProcessor& processor;

    juce::Label titleLabel;
    juce::Label subtitleLabel;
    juce::Label statusLabel;
    juce::Label statusBadgeLabel;
    juce::Label baseUrlLabel;
    juce::Label emailLabel;
    juce::Label passwordLabel;
    juce::Label welcomeLabel;
    juce::Label songTitleLabel;
    juce::Label alternateTitleLabel;
    juce::Label dateLabel;
    juce::Label sessionLocationLabel;
    juce::Label iswcLabel;
    juce::Label isrcLabel;
    juce::Label notesLabel;
    juce::Label contributorsLabel;
    juce::Label contributorsHintLabel;
    juce::Label totalsLabel;
    juce::Label recipientsLabel;
    juce::Label additionalRecipientsLabel;
    juce::Label agreementsLabel;
    juce::Label reviewSummaryTitleLabel;
    juce::Label reviewSummaryLabel;
    juce::Label validationLabel;

    juce::TextEditor baseUrlEditor;
    juce::TextEditor emailEditor;
    juce::TextEditor passwordEditor;
    juce::TextEditor songTitleEditor;
    juce::TextEditor alternateTitleEditor;
    juce::TextEditor dateEditor;
    juce::TextEditor sessionLocationEditor;
    juce::TextEditor iswcEditor;
    juce::TextEditor isrcEditor;
    juce::TextEditor notesEditor;
    juce::TextEditor additionalRecipientOneEditor;
    juce::TextEditor additionalRecipientTwoEditor;

    juce::ToggleButton inviteToggle;
    juce::ToggleButton supersedesPreviousToggle;
    juce::ToggleButton allPartiesAgreeToggle;

    juce::TextButton settingsButton { "Connection Settings" };
    juce::TextButton readyButton { "Check Connection" };
    juce::TextButton loginButton { "Sign In" };
    juce::TextButton songStepButton { "1 Song" };
    juce::TextButton contributorsStepButton { "2 Contributors" };
    juce::TextButton reviewStepButton { "3 Review & Submit" };
    juce::TextButton addContributorButton { "Add Contributor" };
    juce::TextButton setEqualSplitsButton { "Set Equal Splits" };
    juce::TextButton nextStepButton { "Next" };
    juce::TextButton submitButton { "Send Split Sheet" };
    juce::TextButton logoutButton { "Sign Out" };

    juce::Viewport contributorsViewport;
    std::unique_ptr<PaintedComponent> contributorsCanvas;

    std::vector<std::unique_ptr<ContributorRow>> contributorRows;
    std::vector<juce::Rectangle<int>> contributorCardBounds;
    std::vector<std::unique_ptr<juce::ToggleButton>> recipientButtons;
    std::vector<bool> recipientSelections;

    Step currentStep = Step::song;
    bool settingsVisible = false;
    bool restoringSession = false;
};
