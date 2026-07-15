#include "PluginEditor.h"
#include <array>
#include <cmath>

namespace
{
    const auto backgroundColour = juce::Colour::fromRGB(16, 18, 22);
    const auto panelColour = juce::Colour::fromRGB(24, 28, 34);
    const auto sectionColour = juce::Colour::fromRGB(18, 21, 26);
    const auto cardColour = juce::Colour::fromRGB(10, 12, 16);
    const auto fieldColour = juce::Colour::fromRGB(35, 41, 47);
    const auto fieldOutlineColour = juce::Colour::fromRGB(70, 80, 88);
    const auto accentColour = juce::Colour::fromRGB(212, 175, 55);
    const auto successColour = juce::Colour::fromRGB(42, 120, 80);
    const auto warningColour = juce::Colour::fromRGB(125, 95, 30);
    const auto errorColour = juce::Colour::fromRGB(130, 54, 54);
    const auto neutralColour = juce::Colour::fromRGB(59, 70, 79);
    const auto subduedText = juce::Colour::fromRGB(188, 188, 188);
    const auto placeholderColour = juce::Colour::fromRGB(122, 132, 140);

    juce::String todayIso()
    {
        return juce::Time::getCurrentTime().formatted("%Y-%m-%d");
    }

    void styleEditor(juce::TextEditor& editor, const juce::String& placeholder, bool multiline = false)
    {
        editor.setTextToShowWhenEmpty(placeholder, placeholderColour);
        editor.setColour(juce::TextEditor::backgroundColourId, fieldColour);
        editor.setColour(juce::TextEditor::outlineColourId, fieldOutlineColour);
        editor.setColour(juce::TextEditor::focusedOutlineColourId, accentColour);
        editor.setColour(juce::TextEditor::textColourId, juce::Colours::white);
        editor.setColour(juce::TextEditor::highlightedTextColourId, juce::Colours::black);
        editor.setColour(juce::TextEditor::highlightColourId, accentColour);
        editor.setColour(juce::CaretComponent::caretColourId, juce::Colours::white);
        editor.setIndents(10, multiline ? 10 : 8);
        editor.setMultiLine(multiline, true);
        editor.setReturnKeyStartsNewLine(multiline);
        editor.setScrollbarsShown(multiline);
    }

    void styleComboBox(juce::ComboBox& comboBox, const juce::String& placeholder)
    {
        comboBox.setTextWhenNothingSelected(placeholder);
        comboBox.setJustificationType(juce::Justification::centredLeft);
        comboBox.setColour(juce::ComboBox::backgroundColourId, fieldColour);
        comboBox.setColour(juce::ComboBox::outlineColourId, fieldOutlineColour);
        comboBox.setColour(juce::ComboBox::focusedOutlineColourId, accentColour);
        comboBox.setColour(juce::ComboBox::textColourId, juce::Colours::white);
        comboBox.setColour(juce::ComboBox::arrowColourId, juce::Colours::white);
    }

    void styleButton(juce::TextButton& button,
                     juce::Colour colour = juce::Colour::fromRGB(48, 58, 66),
                     juce::Colour text = juce::Colours::white)
    {
        button.setColour(juce::TextButton::buttonColourId, colour);
        button.setColour(juce::TextButton::buttonOnColourId, accentColour);
        button.setColour(juce::TextButton::textColourOffId, text);
        button.setColour(juce::TextButton::textColourOnId, juce::Colours::black);
    }

    void styleStepButton(juce::TextButton& button, bool active)
    {
        styleButton(button, active ? accentColour : juce::Colour::fromRGB(41, 48, 54),
                    active ? juce::Colours::black : juce::Colours::white);
    }

    void styleLabel(juce::Label& label, float size = 14.0f, bool bold = true, juce::Colour colour = juce::Colour::fromRGB(230, 230, 230))
    {
        label.setColour(juce::Label::textColourId, colour);
        label.setFont(juce::FontOptions(size, bold ? juce::Font::bold : juce::Font::plain));
    }

    void styleToggle(juce::ToggleButton& toggle)
    {
        toggle.setColour(juce::ToggleButton::textColourId, juce::Colour::fromRGB(230, 230, 230));
        toggle.setColour(juce::ToggleButton::tickColourId, accentColour);
        toggle.setColour(juce::ToggleButton::tickDisabledColourId, fieldOutlineColour);
    }

    juce::StringArray parseEmailTokens(const juce::String& value)
    {
        juce::StringArray tokens;
        tokens.addTokens(value, ",;", "\"");
        tokens.trim();
        tokens.removeEmptyStrings();
        return tokens;
    }

    juce::String formatPercent(double value)
    {
        return juce::String(value, 2).trimCharactersAtEnd("0").trimCharactersAtEnd(".") + "%";
    }

    double shareValue(const juce::String& value)
    {
        return value.trim().getDoubleValue();
    }

    double effectivePublisherShare(const juce::TextEditor& writerShareEditor, const juce::TextEditor& publisherShareEditor)
    {
        const auto publisherText = publisherShareEditor.getText().trim();
        return publisherText.isNotEmpty() ? shareValue(publisherText) : shareValue(writerShareEditor.getText());
    }
}

class SplitSheetStudioEditor::PaintedComponent final : public juce::Component
{
public:
    std::function<void(juce::Graphics&)> onPaint;

    void paint(juce::Graphics& graphics) override
    {
        graphics.fillAll(juce::Colours::transparentBlack);
        if (onPaint)
            onPaint(graphics);
    }
};

class SplitSheetStudioEditor::SignaturePad final : public juce::Component
{
public:
    explicit SignaturePad(std::function<void()> onChangedCallback)
        : onChanged(std::move(onChangedCallback))
    {
        setMouseCursor(juce::MouseCursor::CrosshairCursor);
    }

    void paint(juce::Graphics& graphics) override
    {
        auto area = getLocalBounds().toFloat();
        graphics.setColour(fieldColour);
        graphics.fillRoundedRectangle(area, 8.0f);

        if (signatureImage.isValid())
            graphics.drawImageWithin(signatureImage, 0, 0, getWidth(), getHeight(), juce::RectanglePlacement::stretchToFit);

        graphics.setColour(accentColour.withAlpha(hasSignature ? 0.85f : 0.45f));
        graphics.drawRoundedRectangle(area.reduced(0.5f), 8.0f, 1.4f);

        if (!hasSignature)
        {
            graphics.setColour(placeholderColour);
            graphics.setFont(juce::FontOptions(13.0f));
            graphics.drawFittedText("Draw signature", getLocalBounds(), juce::Justification::centred, 1);
        }
    }

    void resized() override
    {
        if (getWidth() <= 0 || getHeight() <= 0)
            return;

        if (!signatureImage.isValid())
        {
            signatureImage = juce::Image(juce::Image::ARGB, getWidth(), getHeight(), true);
            return;
        }

        if (signatureImage.getWidth() == getWidth() && signatureImage.getHeight() == getHeight())
            return;

        juce::Image resizedImage(juce::Image::ARGB, getWidth(), getHeight(), true);
        juce::Graphics graphics(resizedImage);
        graphics.drawImageWithin(signatureImage, 0, 0, getWidth(), getHeight(), juce::RectanglePlacement::stretchToFit);
        signatureImage = resizedImage;
    }

    void mouseDown(const juce::MouseEvent& event) override
    {
        ensureImage();
        lastPoint = event.position;
        drawPoint(lastPoint);
    }

    void mouseDrag(const juce::MouseEvent& event) override
    {
        ensureImage();
        juce::Graphics graphics(signatureImage);
        graphics.setColour(juce::Colours::white);
        graphics.drawLine(lastPoint.x, lastPoint.y, event.position.x, event.position.y, 2.4f);
        lastPoint = event.position;
        hasSignature = true;
        repaint();
        if (onChanged)
            onChanged();
    }

    void clear()
    {
        if (signatureImage.isValid())
            signatureImage.clear(signatureImage.getBounds(), juce::Colours::transparentBlack);

        hasSignature = false;
        repaint();
        if (onChanged)
            onChanged();
    }

    bool isSigned() const
    {
        return hasSignature;
    }

    juce::String toDataUrl() const
    {
        if (!hasSignature || !signatureImage.isValid())
            return {};

        juce::MemoryOutputStream stream;
        juce::PNGImageFormat png;
        png.writeImageToStream(signatureImage, stream);
        return "data:image/png;base64," + stream.getMemoryBlock().toBase64Encoding();
    }

private:
    void ensureImage()
    {
        if (!signatureImage.isValid() || signatureImage.getWidth() != getWidth() || signatureImage.getHeight() != getHeight())
            resized();
    }

    void drawPoint(juce::Point<float> point)
    {
        juce::Graphics graphics(signatureImage);
        graphics.setColour(juce::Colours::white);
        graphics.fillEllipse(point.x - 1.6f, point.y - 1.6f, 3.2f, 3.2f);
        hasSignature = true;
        repaint();
        if (onChanged)
            onChanged();
    }

    std::function<void()> onChanged;
    juce::Image signatureImage;
    juce::Point<float> lastPoint;
    bool hasSignature = false;
};

SplitSheetStudioEditor::SplitSheetStudioEditor(SplitSheetStudioProcessor& value)
    : juce::AudioProcessorEditor(&value), processor(value)
{
    contributorsCanvas = std::make_unique<PaintedComponent>();
    contributorsCanvas->onPaint = [this](juce::Graphics& graphics)
    {
        for (const auto& cardBounds : contributorCardBounds)
        {
            graphics.setColour(cardColour);
            graphics.fillRoundedRectangle(cardBounds.toFloat(), 10.0f);
            graphics.setColour(juce::Colour::fromRGB(44, 48, 54));
            graphics.drawRoundedRectangle(cardBounds.toFloat(), 10.0f, 1.0f);
        }
    };
    contributorsViewport.setViewedComponent(contributorsCanvas.get(), false);
    contributorsViewport.setScrollBarsShown(true, false);
    contributorsViewport.setScrollBarThickness(10);

    titleLabel.setText("SplitSheet Studio", juce::dontSendNotification);
    titleLabel.setJustificationType(juce::Justification::centredLeft);
    titleLabel.setFont(juce::FontOptions(24.0f, juce::Font::bold));

    subtitleLabel.setText("Match the full Split Sheet form inside your DAW session.", juce::dontSendNotification);
    subtitleLabel.setJustificationType(juce::Justification::centredLeft);
    subtitleLabel.setColour(juce::Label::textColourId, subduedText);
    subtitleLabel.setFont(juce::FontOptions(12.5f));

    statusLabel.setJustificationType(juce::Justification::centredLeft);
    statusLabel.setColour(juce::Label::textColourId, juce::Colour::fromRGB(227, 227, 227));
    statusLabel.setFont(juce::FontOptions(14.0f, juce::Font::plain));

    statusBadgeLabel.setText("Status", juce::dontSendNotification);
    statusBadgeLabel.setJustificationType(juce::Justification::centred);
    statusBadgeLabel.setColour(juce::Label::textColourId, juce::Colours::white);
    statusBadgeLabel.setFont(juce::FontOptions(12.5f, juce::Font::bold));
    statusBadgeLabel.setOpaque(true);

    baseUrlLabel.setText("App Address", juce::dontSendNotification);
    emailLabel.setText("Email", juce::dontSendNotification);
    passwordLabel.setText("Password", juce::dontSendNotification);
    welcomeLabel.setJustificationType(juce::Justification::centredLeft);
    welcomeLabel.setColour(juce::Label::textColourId, juce::Colour::fromRGB(227, 227, 227));
    welcomeLabel.setFont(juce::FontOptions(15.0f, juce::Font::bold));

    songTitleLabel.setText("Song Title", juce::dontSendNotification);
    alternateTitleLabel.setText("Alternate Title", juce::dontSendNotification);
    dateLabel.setText("Date", juce::dontSendNotification);
    sessionLocationLabel.setText("Session Location", juce::dontSendNotification);
    iswcLabel.setText("ISWC", juce::dontSendNotification);
    isrcLabel.setText("ISRC", juce::dontSendNotification);
    notesLabel.setText("Notes", juce::dontSendNotification);

    contributorsLabel.setText("Contributors", juce::dontSendNotification);
    contributorsHintLabel.setText("Includes legal name, contact, PRO details, shares, typed signature, and drawn signature.", juce::dontSendNotification);
    contributorsHintLabel.setJustificationType(juce::Justification::centredLeft);
    contributorsHintLabel.setColour(juce::Label::textColourId, subduedText);
    contributorsHintLabel.setFont(juce::FontOptions(12.5f));

    totalsLabel.setJustificationType(juce::Justification::centredLeft);
    totalsLabel.setColour(juce::Label::textColourId, subduedText);
    totalsLabel.setFont(juce::FontOptions(12.5f, juce::Font::bold));

    recipientsLabel.setText("Recipients", juce::dontSendNotification);
    additionalRecipientsLabel.setText("Additional Recipients", juce::dontSendNotification);
    agreementsLabel.setText("Confirmations", juce::dontSendNotification);
    reviewSummaryTitleLabel.setText("Review Summary", juce::dontSendNotification);
    reviewSummaryLabel.setJustificationType(juce::Justification::topLeft);
    reviewSummaryLabel.setColour(juce::Label::textColourId, subduedText);
    reviewSummaryLabel.setFont(juce::FontOptions(13.0f));

    validationLabel.setJustificationType(juce::Justification::centredLeft);
    validationLabel.setColour(juce::Label::textColourId, subduedText);
    validationLabel.setFont(juce::FontOptions(12.5f));

    for (auto* label : std::array<juce::Label*, 14>{
             &baseUrlLabel, &emailLabel, &passwordLabel, &songTitleLabel, &alternateTitleLabel,
             &dateLabel, &sessionLocationLabel, &iswcLabel, &isrcLabel, &notesLabel,
             &contributorsLabel, &recipientsLabel, &additionalRecipientsLabel, &agreementsLabel })
    {
        styleLabel(*label);
    }
    styleLabel(reviewSummaryTitleLabel);

    baseUrlEditor.setText(processor.getApiClient().getBaseUrl(), juce::dontSendNotification);
    styleEditor(baseUrlEditor, "https://app.splitsheetstudio.com");
    emailEditor.setText(processor.getUserEmail(), juce::dontSendNotification);
    emailEditor.setInputRestrictions(256);
    styleEditor(emailEditor, "name@example.com");
    passwordEditor.setPasswordCharacter('*');
    styleEditor(passwordEditor, "Password");
    styleEditor(songTitleEditor, "Song title");
    styleEditor(alternateTitleEditor, "Alternate title");
    styleEditor(dateEditor, "YYYY-MM-DD");
    styleEditor(sessionLocationEditor, "City, studio, or room");
    styleEditor(iswcEditor, "ISWC");
    styleEditor(isrcEditor, "ISRC");
    styleEditor(notesEditor, "Session notes", true);
    styleEditor(additionalRecipientOneEditor, "email@example.com");
    styleEditor(additionalRecipientTwoEditor, "email@example.com");

    dateEditor.setText(todayIso(), juce::dontSendNotification);

    songTitleEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    alternateTitleEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    dateEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    sessionLocationEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    iswcEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    isrcEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    notesEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    additionalRecipientOneEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    additionalRecipientTwoEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };

    inviteToggle.setButtonText("Collect signatures by invite links instead of in-session signing");
    supersedesPreviousToggle.setButtonText("This split supersedes any previous draft for this song.");
    allPartiesAgreeToggle.setButtonText("All parties reviewed and agree to these splits.");
    styleToggle(inviteToggle);
    styleToggle(supersedesPreviousToggle);
    styleToggle(allPartiesAgreeToggle);

    inviteToggle.setToggleState(true, juce::dontSendNotification);
    inviteToggle.onClick = [this] { refreshReviewSummary(); refreshSubmitState(); };
    supersedesPreviousToggle.onClick = [this] { refreshReviewSummary(); refreshSubmitState(); };
    allPartiesAgreeToggle.onClick = [this] { refreshReviewSummary(); refreshSubmitState(); };

    styleButton(settingsButton);
    styleButton(readyButton);
    styleButton(loginButton, accentColour, juce::Colours::black);
    styleButton(createAccountButton);
    styleButton(forgotPasswordButton);
    styleButton(addContributorButton);
    styleButton(setEqualSplitsButton);
    styleButton(nextStepButton);
    styleButton(submitButton, accentColour, juce::Colours::black);
    styleButton(logoutButton);
    styleStepButton(songStepButton, true);
    styleStepButton(contributorsStepButton, false);
    styleStepButton(reviewStepButton, false);

    settingsButton.addListener(this);
    readyButton.addListener(this);
    loginButton.addListener(this);
    createAccountButton.addListener(this);
    forgotPasswordButton.addListener(this);
    songStepButton.addListener(this);
    contributorsStepButton.addListener(this);
    reviewStepButton.addListener(this);
    addContributorButton.addListener(this);
    setEqualSplitsButton.addListener(this);
    nextStepButton.addListener(this);
    submitButton.addListener(this);
    logoutButton.addListener(this);

    for (auto* component : std::array<juce::Component*, 33>{
             &titleLabel, &subtitleLabel, &statusBadgeLabel, &statusLabel, &settingsButton,
             &baseUrlLabel, &baseUrlEditor, &readyButton, &emailLabel, &emailEditor,
             &passwordLabel, &passwordEditor, &loginButton, &createAccountButton,
             &forgotPasswordButton, &songStepButton,
             &contributorsStepButton, &reviewStepButton, &welcomeLabel, &songTitleLabel,
             &songTitleEditor, &alternateTitleLabel, &alternateTitleEditor, &dateLabel,
             &dateEditor, &sessionLocationLabel, &sessionLocationEditor, &iswcLabel,
             &iswcEditor, &isrcLabel, &isrcEditor, &notesLabel, &notesEditor })
    {
        addAndMakeVisible(*component);
    }

    addAndMakeVisible(contributorsViewport);

    for (auto* component : std::array<juce::Component*, 14>{
             &contributorsLabel, &contributorsHintLabel, &totalsLabel, &addContributorButton,
             &setEqualSplitsButton, &nextStepButton, &recipientsLabel, &additionalRecipientsLabel,
             &agreementsLabel, &reviewSummaryTitleLabel, &reviewSummaryLabel,
             &additionalRecipientOneEditor, &additionalRecipientTwoEditor, &validationLabel })
    {
        addAndMakeVisible(*component);
    }

    addAndMakeVisible(inviteToggle);
    addAndMakeVisible(supersedesPreviousToggle);
    addAndMakeVisible(allPartiesAgreeToggle);
    addAndMakeVisible(submitButton);
    addAndMakeVisible(logoutButton);

    buildContributorRow();

    updateStatus("Ready", neutralColour);
    setSize(980, 760);

    restoreSessionIfNeeded();
    refreshViewState();
}

SplitSheetStudioEditor::~SplitSheetStudioEditor()
{
    settingsButton.removeListener(this);
    readyButton.removeListener(this);
    loginButton.removeListener(this);
    createAccountButton.removeListener(this);
    forgotPasswordButton.removeListener(this);
    songStepButton.removeListener(this);
    contributorsStepButton.removeListener(this);
    reviewStepButton.removeListener(this);
    addContributorButton.removeListener(this);
    setEqualSplitsButton.removeListener(this);
    nextStepButton.removeListener(this);
    submitButton.removeListener(this);
    logoutButton.removeListener(this);

    for (auto& row : contributorRows)
    {
        row->clearSignatureButton->removeListener(this);
        row->removeButton->removeListener(this);
    }
}

void SplitSheetStudioEditor::paint(juce::Graphics& graphics)
{
    auto bounds = getLocalBounds().toFloat();
    graphics.fillAll(backgroundColour);

    juce::ColourGradient gradient(panelColour, 0.0f, 0.0f,
                                  juce::Colour::fromRGB(12, 14, 18), 0.0f, bounds.getBottom(),
                                  false);
    graphics.setGradientFill(gradient);
    graphics.fillRoundedRectangle(bounds.reduced(14.0f), 18.0f);

    graphics.setColour(accentColour.withAlpha(0.95f));
    graphics.drawRoundedRectangle(bounds.reduced(14.0f), 18.0f, 1.6f);

    auto topAccent = bounds.reduced(14.0f).removeFromTop(8.0f);
    graphics.fillRoundedRectangle(topAccent.removeFromLeft(250.0f), 4.0f);

    if (isAuthenticated())
    {
        auto contentArea = getLocalBounds().reduced(24);
        contentArea.removeFromTop(164 + (settingsVisible ? 68 : 0));
        contentArea.removeFromBottom(58);
        graphics.setColour(sectionColour.withAlpha(0.88f));
        graphics.fillRoundedRectangle(contentArea.toFloat(), 14.0f);
        graphics.setColour(juce::Colour::fromRGB(44, 48, 54));
        graphics.drawRoundedRectangle(contentArea.toFloat(), 14.0f, 1.0f);
    }
}

void SplitSheetStudioEditor::resized()
{
    auto area = getLocalBounds().reduced(24);
    auto header = area.removeFromTop(54);
    titleLabel.setBounds(header.removeFromTop(28));
    subtitleLabel.setBounds(header.removeFromTop(18));
    area.removeFromTop(8);

    auto statusRow = area.removeFromTop(28);
    statusBadgeLabel.setBounds(statusRow.removeFromLeft(92));
    statusRow.removeFromLeft(10);
    settingsButton.setBounds(statusRow.removeFromRight(170));
    statusRow.removeFromRight(10);
    statusLabel.setBounds(statusRow);
    area.removeFromTop(10);

    if (settingsVisible)
    {
        auto settingsRow = area.removeFromTop(58);
        auto labelArea = settingsRow.removeFromLeft(150);
        baseUrlLabel.setBounds(labelArea.removeFromTop(20));
        settingsRow.removeFromLeft(8);
        readyButton.setBounds(settingsRow.removeFromRight(150));
        settingsRow.removeFromRight(10);
        baseUrlEditor.setBounds(settingsRow.removeFromTop(32));
        area.removeFromTop(10);
    }

    if (!isAuthenticated())
    {
        auto loginArea = area.removeFromTop(270);
        loginArea = loginArea.withSizeKeepingCentre(420, 270);

        emailLabel.setBounds(loginArea.removeFromTop(20));
        loginArea.removeFromTop(4);
        emailEditor.setBounds(loginArea.removeFromTop(32));
        loginArea.removeFromTop(10);

        passwordLabel.setBounds(loginArea.removeFromTop(20));
        loginArea.removeFromTop(4);
        passwordEditor.setBounds(loginArea.removeFromTop(32));
        loginArea.removeFromTop(18);

        loginButton.setBounds(loginArea.removeFromTop(42).removeFromLeft(180));
        loginArea.removeFromTop(12);
        createAccountButton.setBounds(loginArea.removeFromTop(36));
        loginArea.removeFromTop(8);
        forgotPasswordButton.setBounds(loginArea.removeFromTop(36));
        return;
    }

    auto tabRow = area.removeFromTop(32);
    songStepButton.setBounds(tabRow.removeFromLeft(120));
    tabRow.removeFromLeft(8);
    contributorsStepButton.setBounds(tabRow.removeFromLeft(150));
    tabRow.removeFromLeft(8);
    reviewStepButton.setBounds(tabRow.removeFromLeft(180));
    area.removeFromTop(12);

    welcomeLabel.setBounds(area.removeFromTop(24));
    area.removeFromTop(10);

    auto footer = area.removeFromBottom(48);
    validationLabel.setBounds(footer.removeFromLeft(getWidth() - 280));
    footer.removeFromLeft(12);
    if (currentStep == Step::review)
    {
        submitButton.setBounds(footer.removeFromLeft(190));
        footer.removeFromLeft(12);
    }
    else
    {
        nextStepButton.setBounds(footer.removeFromLeft(190));
        footer.removeFromLeft(12);
    }
    logoutButton.setBounds(footer.removeFromLeft(140));

    auto contentArea = area;

    switch (currentStep)
    {
        case Step::song:
        {
            auto row1 = contentArea.removeFromTop(58);
            auto songTitleArea = row1.removeFromLeft(440);
            songTitleLabel.setBounds(songTitleArea.removeFromTop(20));
            songTitleArea.removeFromTop(4);
            songTitleEditor.setBounds(songTitleArea.removeFromTop(32));
            row1.removeFromLeft(16);
            auto dateArea = row1.removeFromLeft(180);
            dateLabel.setBounds(dateArea.removeFromTop(20));
            dateArea.removeFromTop(4);
            dateEditor.setBounds(dateArea.removeFromTop(32));
            contentArea.removeFromTop(12);

            auto row2 = contentArea.removeFromTop(58);
            auto alternateArea = row2.removeFromLeft(440);
            alternateTitleLabel.setBounds(alternateArea.removeFromTop(20));
            alternateArea.removeFromTop(4);
            alternateTitleEditor.setBounds(alternateArea.removeFromTop(32));
            row2.removeFromLeft(16);
            auto locationArea = row2.removeFromLeft(300);
            sessionLocationLabel.setBounds(locationArea.removeFromTop(20));
            locationArea.removeFromTop(4);
            sessionLocationEditor.setBounds(locationArea.removeFromTop(32));
            contentArea.removeFromTop(12);

            auto row3 = contentArea.removeFromTop(58);
            auto iswcArea = row3.removeFromLeft(280);
            iswcLabel.setBounds(iswcArea.removeFromTop(20));
            iswcArea.removeFromTop(4);
            iswcEditor.setBounds(iswcArea.removeFromTop(32));
            row3.removeFromLeft(16);
            auto isrcArea = row3.removeFromLeft(280);
            isrcLabel.setBounds(isrcArea.removeFromTop(20));
            isrcArea.removeFromTop(4);
            isrcEditor.setBounds(isrcArea.removeFromTop(32));
            contentArea.removeFromTop(12);

            notesLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(4);
            notesEditor.setBounds(contentArea.removeFromTop(140));
            break;
        }

        case Step::contributors:
        {
            auto headerRow = contentArea.removeFromTop(26);
            contributorsLabel.setBounds(headerRow.removeFromLeft(160));
            setEqualSplitsButton.setBounds(headerRow.removeFromRight(150));
            headerRow.removeFromRight(10);
            addContributorButton.setBounds(headerRow.removeFromRight(150));
            contentArea.removeFromTop(6);
            contributorsHintLabel.setBounds(contentArea.removeFromTop(18));
            contentArea.removeFromTop(6);
            totalsLabel.setBounds(contentArea.removeFromTop(18));
            contentArea.removeFromTop(10);
            contributorsViewport.setBounds(contentArea);
            refreshContributorCanvas();
            break;
        }

        case Step::review:
        {
            recipientsLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(6);

            for (auto& button : recipientButtons)
            {
                if (!button->isVisible())
                    continue;

                button->setBounds(contentArea.removeFromTop(24));
                contentArea.removeFromTop(4);
            }

            contentArea.removeFromTop(6);
            additionalRecipientsLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(4);

            auto recipientRow = contentArea.removeFromTop(32);
            additionalRecipientOneEditor.setBounds(recipientRow.removeFromLeft(320));
            recipientRow.removeFromLeft(12);
            additionalRecipientTwoEditor.setBounds(recipientRow.removeFromLeft(320));
            contentArea.removeFromTop(14);

            agreementsLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(6);
            inviteToggle.setBounds(contentArea.removeFromTop(24));
            contentArea.removeFromTop(4);
            supersedesPreviousToggle.setBounds(contentArea.removeFromTop(24));
            contentArea.removeFromTop(4);
            allPartiesAgreeToggle.setBounds(contentArea.removeFromTop(24));
            contentArea.removeFromTop(16);

            reviewSummaryTitleLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(6);
            reviewSummaryLabel.setBounds(contentArea.removeFromTop(180));
            break;
        }
    }
}

void SplitSheetStudioEditor::buttonClicked(juce::Button* button)
{
    if (button == &settingsButton)
    {
        toggleSettings();
        return;
    }

    if (button == &readyButton)
    {
        juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
        processor.getApiClient().setBaseUrl(baseUrlEditor.getText());
        updateStatus("Checking connection...", warningColour);
        setBusy(true);

        processor.getApiClient().fetchReady([safeThis](SplitSheetApiClient::ReadyResponse response)
        {
            if (safeThis == nullptr)
                return;

            auto& editor = *safeThis;
            editor.updateStatus(response.ok ? "Connection is ready." : "Could not reach SplitSheet.",
                                response.ok ? successColour : errorColour);
            editor.setBusy(false);
        });
        return;
    }

    if (button == &loginButton)
    {
        runLogin();
        return;
    }

    if (button == &createAccountButton || button == &forgotPasswordButton)
    {
        const auto accountUrl = processor.getApiClient().getBaseUrl() + (button == &createAccountButton ? "/signup" : "/forgot-password");
        juce::URL(accountUrl).launchInDefaultBrowser();
        return;
    }

    if (button == &songStepButton)
    {
        switchStep(Step::song);
        return;
    }

    if (button == &contributorsStepButton)
    {
        switchStep(Step::contributors);
        return;
    }

    if (button == &reviewStepButton)
    {
        switchStep(Step::review);
        return;
    }

    if (button == &addContributorButton)
    {
        buildContributorRow();
        resized();
        repaint();
        return;
    }

    if (button == &setEqualSplitsButton)
    {
        if (contributorRows.empty())
            return;

        const auto rowCount = static_cast<int>(contributorRows.size());
        double remainingWriter = 100.0;
        double remainingPublisher = 100.0;

        for (int index = 0; index < rowCount; ++index)
        {
            const bool last = index == rowCount - 1;
            const double writer = last ? remainingWriter : std::round((10000.0 / rowCount)) / 100.0;
            const double publisher = last ? remainingPublisher : std::round((10000.0 / rowCount)) / 100.0;
            contributorRows[static_cast<size_t>(index)]->writerShare->setText(juce::String(writer, 2), juce::dontSendNotification);
            contributorRows[static_cast<size_t>(index)]->publisherShare->setText(juce::String(publisher, 2), juce::dontSendNotification);
            remainingWriter -= writer;
            remainingPublisher -= publisher;
        }

        refreshReviewSummary();
        refreshSubmitState();
        return;
    }

    if (button == &nextStepButton)
    {
        if (currentStep == Step::song)
            switchStep(Step::contributors);
        else if (currentStep == Step::contributors)
            switchStep(Step::review);
        return;
    }

    if (button == &submitButton)
    {
        submitSplitSheet();
        return;
    }

    if (button == &logoutButton)
    {
        runLogout();
        return;
    }

    for (int index = 0; index < static_cast<int>(contributorRows.size()); ++index)
    {
        auto& row = contributorRows[static_cast<size_t>(index)];
        if (button == row->removeButton.get())
        {
            removeContributorRow(index);
            return;
        }

        if (button == row->clearSignatureButton.get())
        {
            row->signaturePad->clear();
            return;
        }
    }
}

void SplitSheetStudioEditor::buildContributorRow()
{
    auto row = std::make_unique<ContributorRow>();
    row->titleLabel = std::make_unique<juce::Label>();
    row->legalName = std::make_unique<juce::TextEditor>();
    row->role = std::make_unique<juce::ComboBox>();
    row->address = std::make_unique<juce::TextEditor>();
    row->phone = std::make_unique<juce::TextEditor>();
    row->email = std::make_unique<juce::TextEditor>();
    row->pro = std::make_unique<juce::TextEditor>();
    row->ipi = std::make_unique<juce::TextEditor>();
    row->publisherName = std::make_unique<juce::TextEditor>();
    row->publisherIpi = std::make_unique<juce::TextEditor>();
    row->writerShare = std::make_unique<juce::TextEditor>();
    row->publisherShare = std::make_unique<juce::TextEditor>();
    row->typedSignatureName = std::make_unique<juce::TextEditor>();
    row->signatureLabel = std::make_unique<juce::Label>();
    row->signaturePad = std::make_unique<SignaturePad>([this]
    {
        refreshReviewSummary();
        refreshSubmitState();
    });
    row->clearSignatureButton = std::make_unique<juce::TextButton>("Clear Signature");
    row->removeButton = std::make_unique<juce::TextButton>("X");

    row->titleLabel->setJustificationType(juce::Justification::centredLeft);
    row->titleLabel->setColour(juce::Label::textColourId, juce::Colours::white);
    row->titleLabel->setFont(juce::FontOptions(13.5f, juce::Font::bold));

    row->signatureLabel->setText("Draw signature", juce::dontSendNotification);
    styleLabel(*row->signatureLabel, 12.5f, true, subduedText);

    styleEditor(*row->legalName, "Legal name");
    styleComboBox(*row->role, "Role");
    row->role->addItem("Writer", 1);
    row->role->addItem("Producer", 2);
    row->role->addItem("Artist", 3);
    row->role->addItem("Composer", 4);
    row->role->addItem("Songwriter", 5);
    row->role->addItem("Other", 6);
    styleEditor(*row->address, "Address");
    styleEditor(*row->phone, "Phone");
    styleEditor(*row->email, "Email");
    styleEditor(*row->pro, "PRO");
    styleEditor(*row->ipi, "IPI #");
    styleEditor(*row->publisherName, "Publisher name");
    styleEditor(*row->publisherIpi, "Publisher IPI #");
    styleEditor(*row->writerShare, "Writer share %");
    styleEditor(*row->publisherShare, "Publisher share %");
    styleEditor(*row->typedSignatureName, "Typed signature name");

    row->writerShare->setInputRestrictions(6, "0123456789.");
    row->publisherShare->setInputRestrictions(6, "0123456789.");

    auto onChange = [this]
    {
        refreshRecipientButtons();
        refreshReviewSummary();
        refreshSubmitState();
    };

    row->legalName->onTextChange = onChange;
    row->role->onChange = onChange;
    row->address->onTextChange = onChange;
    row->phone->onTextChange = onChange;
    row->email->onTextChange = onChange;
    row->pro->onTextChange = onChange;
    row->ipi->onTextChange = onChange;
    row->publisherName->onTextChange = onChange;
    row->publisherIpi->onTextChange = onChange;
    row->writerShare->onTextChange = onChange;
    row->publisherShare->onTextChange = onChange;
    row->typedSignatureName->onTextChange = onChange;

    styleButton(*row->clearSignatureButton);
    styleButton(*row->removeButton);
    row->clearSignatureButton->addListener(this);
    row->removeButton->addListener(this);

    for (auto* component : std::array<juce::Component*, 16>{
             row->titleLabel.get(), row->legalName.get(), row->role.get(), row->address.get(),
             row->phone.get(), row->email.get(), row->pro.get(), row->ipi.get(),
             row->publisherName.get(), row->publisherIpi.get(), row->writerShare.get(),
             row->publisherShare.get(), row->typedSignatureName.get(), row->signatureLabel.get(),
             row->signaturePad.get(), row->clearSignatureButton.get() })
    {
        contributorsCanvas->addAndMakeVisible(*component);
    }

    contributorsCanvas->addAndMakeVisible(*row->removeButton);

    contributorRows.push_back(std::move(row));
    recipientSelections.push_back(true);
    updateContributorTitles();
    refreshRecipientButtons();
    refreshContributorCanvas();
    refreshSubmitState();
}

void SplitSheetStudioEditor::removeContributorRow(int index)
{
    if (contributorRows.size() <= 1 || index < 0 || index >= static_cast<int>(contributorRows.size()))
        return;

    contributorRows[static_cast<size_t>(index)]->clearSignatureButton->removeListener(this);
    contributorRows[static_cast<size_t>(index)]->removeButton->removeListener(this);
    contributorRows.erase(contributorRows.begin() + index);
    recipientSelections.erase(recipientSelections.begin() + index);
    updateContributorTitles();
    refreshRecipientButtons();
    refreshContributorCanvas();
    refreshReviewSummary();
    refreshSubmitState();
    resized();
    repaint();
}

void SplitSheetStudioEditor::refreshViewState()
{
    const auto authed = isAuthenticated();

    baseUrlLabel.setVisible(settingsVisible);
    baseUrlEditor.setVisible(settingsVisible);
    readyButton.setVisible(settingsVisible);

    emailLabel.setVisible(!authed);
    emailEditor.setVisible(!authed);
    passwordLabel.setVisible(!authed);
    passwordEditor.setVisible(!authed);
    loginButton.setVisible(!authed);
    createAccountButton.setVisible(!authed);
    forgotPasswordButton.setVisible(!authed);

    songStepButton.setVisible(authed);
    contributorsStepButton.setVisible(authed);
    reviewStepButton.setVisible(authed);
    welcomeLabel.setVisible(authed);
    validationLabel.setVisible(authed);
    logoutButton.setVisible(authed);
    nextStepButton.setVisible(authed && currentStep != Step::review);
    submitButton.setVisible(authed && currentStep == Step::review);

    const auto showSong = authed && currentStep == Step::song;
    const auto showContributors = authed && currentStep == Step::contributors;
    const auto showReview = authed && currentStep == Step::review;

    songTitleLabel.setVisible(showSong);
    songTitleEditor.setVisible(showSong);
    alternateTitleLabel.setVisible(showSong);
    alternateTitleEditor.setVisible(showSong);
    dateLabel.setVisible(showSong);
    dateEditor.setVisible(showSong);
    sessionLocationLabel.setVisible(showSong);
    sessionLocationEditor.setVisible(showSong);
    iswcLabel.setVisible(showSong);
    iswcEditor.setVisible(showSong);
    isrcLabel.setVisible(showSong);
    isrcEditor.setVisible(showSong);
    notesLabel.setVisible(showSong);
    notesEditor.setVisible(showSong);

    contributorsLabel.setVisible(showContributors);
    contributorsHintLabel.setVisible(showContributors);
    totalsLabel.setVisible(showContributors);
    addContributorButton.setVisible(showContributors);
    setEqualSplitsButton.setVisible(showContributors);
    contributorsViewport.setVisible(showContributors);

    for (auto& row : contributorRows)
    {
        row->titleLabel->setVisible(showContributors);
        row->legalName->setVisible(showContributors);
        row->role->setVisible(showContributors);
        row->address->setVisible(showContributors);
        row->phone->setVisible(showContributors);
        row->email->setVisible(showContributors);
        row->pro->setVisible(showContributors);
        row->ipi->setVisible(showContributors);
        row->publisherName->setVisible(showContributors);
        row->publisherIpi->setVisible(showContributors);
        row->writerShare->setVisible(showContributors);
        row->publisherShare->setVisible(showContributors);
        row->typedSignatureName->setVisible(showContributors);
        row->signatureLabel->setVisible(showContributors);
        row->signaturePad->setVisible(showContributors);
        row->clearSignatureButton->setVisible(showContributors);
        row->removeButton->setVisible(showContributors && contributorRows.size() > 1 && row.get() != contributorRows.front().get());
    }

    recipientsLabel.setVisible(showReview);
    additionalRecipientsLabel.setVisible(showReview);
    agreementsLabel.setVisible(showReview);
    inviteToggle.setVisible(showReview);
    supersedesPreviousToggle.setVisible(showReview);
    allPartiesAgreeToggle.setVisible(showReview);
    reviewSummaryTitleLabel.setVisible(showReview);
    reviewSummaryLabel.setVisible(showReview);
    additionalRecipientOneEditor.setVisible(showReview);
    additionalRecipientTwoEditor.setVisible(showReview);

    for (size_t index = 0; index < recipientButtons.size(); ++index)
        recipientButtons[index]->setVisible(showReview && index < contributorRows.size());

    if (authed)
        populateSignedInDefaults();

    updateStepButtons();
    nextStepButton.setButtonText(currentStep == Step::song ? "Next: Contributors" : "Next: Review");
    refreshRecipientButtons();
    refreshReviewSummary();
    refreshSubmitState();
    resized();
    repaint();
}

void SplitSheetStudioEditor::restoreSessionIfNeeded()
{
    if (processor.getRefreshToken().isEmpty())
        return;

    restoringSession = true;
    updateStatus("Restoring session...", warningColour);
    setBusy(true);

    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    processor.getApiClient().refreshSession(processor.getRefreshToken(),
                                            [safeThis](SplitSheetApiClient::LoginResponse response)
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        editor.restoringSession = false;

        if (response.ok)
        {
            editor.processor.setAccessToken(response.accessToken);
            editor.processor.setRefreshToken(response.refreshToken);
            editor.processor.setUserEmail(response.userEmail);
            editor.processor.setDisplayName(response.displayName);
            editor.updateStatus("Signed in as " + (response.displayName.isNotEmpty() ? response.displayName : response.userEmail),
                                successColour);
        }
        else
        {
            editor.processor.clearSession();
            editor.updateStatus("Sign in to continue.", neutralColour);
        }

        editor.setBusy(false);
        editor.refreshViewState();
    });
}

void SplitSheetStudioEditor::runLogin()
{
    processor.getApiClient().setBaseUrl(baseUrlEditor.getText());
    updateStatus("Signing in...", warningColour);
    setBusy(true);

    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    processor.getApiClient().login(emailEditor.getText(), passwordEditor.getText(),
                                   [safeThis](SplitSheetApiClient::LoginResponse response)
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        if (response.ok)
        {
            editor.processor.setAccessToken(response.accessToken);
            editor.processor.setRefreshToken(response.refreshToken);
            editor.processor.setUserEmail(response.userEmail);
            editor.processor.setDisplayName(response.displayName);
            editor.passwordEditor.clear();
            editor.updateStatus("Signed in as " + (response.displayName.isNotEmpty() ? response.displayName : response.userEmail),
                                successColour);
            editor.refreshViewState();
        }
        else
        {
            editor.updateStatus(response.errorMessage.isNotEmpty() ? response.errorMessage : "Sign in failed",
                                errorColour);
        }

        editor.setBusy(false);
    });
}

void SplitSheetStudioEditor::runLogout()
{
    const auto refreshToken = processor.getRefreshToken();
    processor.clearSession();
    refreshViewState();
    updateStatus("Signed out.", neutralColour);

    if (refreshToken.isEmpty())
        return;

    processor.getApiClient().logout(refreshToken, [] {});
}

void SplitSheetStudioEditor::submitSplitSheet()
{
    const auto message = validationMessage();
    if (message.isNotEmpty())
    {
        refreshSubmitState();
        return;
    }

    updateStatus("Sending split sheet...", warningColour);
    setBusy(true);

    const auto payload = buildSubmissionPayload();
    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    processor.getApiClient().createSplitSheet(processor.getAccessToken(), payload,
                                              [safeThis](SplitSheetApiClient::SplitSheetResponse response)
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        if (response.ok)
        {
            editor.updateStatus("Split sheet sent for " + response.songTitle, successColour);
            editor.resetForm();
        }
        else
        {
            editor.updateStatus(response.errorMessage.isNotEmpty() ? response.errorMessage : "Could not send split sheet",
                                errorColour);
        }

        editor.setBusy(false);
    });
}

void SplitSheetStudioEditor::updateStatus(juce::String message, juce::Colour colour)
{
    processor.setStatusText(message);
    statusLabel.setText(message, juce::dontSendNotification);
    statusBadgeLabel.setColour(juce::Label::backgroundColourId, colour);
    repaint();
}

void SplitSheetStudioEditor::setBusy(bool busy)
{
    settingsButton.setEnabled(!busy);
    readyButton.setEnabled(!busy);
    loginButton.setEnabled(!busy);
    createAccountButton.setEnabled(!busy);
    forgotPasswordButton.setEnabled(!busy);
    songStepButton.setEnabled(!busy);
    contributorsStepButton.setEnabled(!busy);
    reviewStepButton.setEnabled(!busy);
    addContributorButton.setEnabled(!busy);
    setEqualSplitsButton.setEnabled(!busy);
    nextStepButton.setEnabled(!busy);
    logoutButton.setEnabled(!busy);

    for (auto& row : contributorRows)
    {
        row->removeButton->setEnabled(!busy);
        row->clearSignatureButton->setEnabled(!busy);
        row->signaturePad->setEnabled(!busy);
    }

    if (!busy)
        refreshSubmitState();
    else
        submitButton.setEnabled(false);
}

void SplitSheetStudioEditor::toggleSettings()
{
    settingsVisible = !settingsVisible;
    settingsButton.setButtonText(settingsVisible ? "Hide Settings" : "Connection Settings");
    refreshViewState();
}

void SplitSheetStudioEditor::switchStep(Step step)
{
    currentStep = step;
    refreshViewState();
}

void SplitSheetStudioEditor::updateStepButtons()
{
    styleStepButton(songStepButton, currentStep == Step::song);
    styleStepButton(contributorsStepButton, currentStep == Step::contributors);
    styleStepButton(reviewStepButton, currentStep == Step::review);
}

void SplitSheetStudioEditor::updateContributorTitles()
{
    for (int index = 0; index < static_cast<int>(contributorRows.size()); ++index)
    {
        contributorRows[static_cast<size_t>(index)]->titleLabel->setText("Contributor " + juce::String(index + 1),
                                                                         juce::dontSendNotification);
        contributorRows[static_cast<size_t>(index)]->removeButton->setVisible(index > 0);
    }
}

void SplitSheetStudioEditor::refreshContributorCanvas()
{
    totalsLabel.setText("Writer total: " + formatPercent(writerTotal()) + "   •   Publisher total: " + formatPercent(publisherTotal()),
                        juce::dontSendNotification);

    if (!contributorsViewport.isVisible())
        return;

    contributorCardBounds.clear();
    const auto canvasWidth = juce::jmax(720, contributorsViewport.getWidth() - 14);
    int y = 8;

    for (auto& row : contributorRows)
    {
        juce::Rectangle<int> card(8, y, canvasWidth - 16, 372);
        contributorCardBounds.push_back(card);

        auto inner = card.reduced(14);
        auto titleRow = inner.removeFromTop(24);
        row->titleLabel->setBounds(titleRow.removeFromLeft(180));
        row->removeButton->setBounds(titleRow.removeFromRight(34));
        inner.removeFromTop(8);

        auto row1 = inner.removeFromTop(30);
        row->legalName->setBounds(row1.removeFromLeft((inner.getWidth() - 12) / 2));
        row1.removeFromLeft(12);
        row->role->setBounds(row1);
        inner.removeFromTop(8);

        auto row2 = inner.removeFromTop(30);
        row->address->setBounds(row2.removeFromLeft((inner.getWidth() - 12) / 2));
        row2.removeFromLeft(12);
        row->phone->setBounds(row2);
        inner.removeFromTop(8);

        auto row3 = inner.removeFromTop(30);
        row->email->setBounds(row3.removeFromLeft((inner.getWidth() - 12) / 2));
        row3.removeFromLeft(12);
        row->pro->setBounds(row3);
        inner.removeFromTop(8);

        auto row4 = inner.removeFromTop(30);
        row->ipi->setBounds(row4.removeFromLeft((inner.getWidth() - 12) / 2));
        row4.removeFromLeft(12);
        row->publisherName->setBounds(row4);
        inner.removeFromTop(8);

        auto row5 = inner.removeFromTop(30);
        row->publisherIpi->setBounds(row5.removeFromLeft((inner.getWidth() - 12) / 2));
        row5.removeFromLeft(12);
        row->writerShare->setBounds(row5);
        inner.removeFromTop(8);

        auto row6 = inner.removeFromTop(30);
        row->publisherShare->setBounds(row6.removeFromLeft(180));
        row6.removeFromLeft(12);
        row->typedSignatureName->setBounds(row6);
        inner.removeFromTop(8);

        auto signatureRow = inner.removeFromTop(18);
        row->signatureLabel->setBounds(signatureRow.removeFromLeft(120));
        row->clearSignatureButton->setBounds(signatureRow.removeFromRight(140));
        inner.removeFromTop(6);
        row->signaturePad->setBounds(inner.removeFromTop(128));

        y += card.getHeight() + 12;
    }

    contributorsCanvas->setSize(canvasWidth, y + 8);
    contributorsCanvas->repaint();
}

void SplitSheetStudioEditor::refreshRecipientButtons()
{
    if (recipientSelections.size() < contributorRows.size())
        recipientSelections.resize(contributorRows.size(), true);

    while (recipientButtons.size() < contributorRows.size())
    {
        auto button = std::make_unique<juce::ToggleButton>();
        styleToggle(*button);
        const auto index = recipientButtons.size();
        button->onClick = [this, index]
        {
            if (index < recipientSelections.size())
                recipientSelections[index] = recipientButtons[index]->getToggleState();

            refreshReviewSummary();
            refreshSubmitState();
        };
        addAndMakeVisible(*button);
        recipientButtons.push_back(std::move(button));
    }

    for (size_t index = 0; index < recipientButtons.size(); ++index)
    {
        auto& button = recipientButtons[index];
        if (index >= contributorRows.size())
        {
            button->setVisible(false);
            continue;
        }

        const auto email = contributorRows[index]->email->getText().trim();
        const auto labelText = email.isNotEmpty()
            ? "Send copy to contributor #" + juce::String(static_cast<int>(index) + 1) + ": " + email
            : "Contributor #" + juce::String(static_cast<int>(index) + 1) + " email missing";

        button->setButtonText(labelText);
        button->setEnabled(email.isNotEmpty());
        button->setToggleState(email.isNotEmpty() ? recipientSelections[index] : false, juce::dontSendNotification);
        if (email.isEmpty())
            recipientSelections[index] = false;
    }
}

void SplitSheetStudioEditor::refreshReviewSummary()
{
    const auto recipients = collectRecipientEmails();
    int signedCount = 0;
    for (const auto& row : contributorRows)
    {
        if (row->signaturePad->isSigned())
            ++signedCount;
    }

    juce::String summary;
    summary << "Song: " << (songTitleEditor.getText().trim().isNotEmpty() ? songTitleEditor.getText().trim() : "(missing)") << "\n";
    summary << "Alternate title: " << (alternateTitleEditor.getText().trim().isNotEmpty() ? alternateTitleEditor.getText().trim() : "None") << "\n";
    summary << "Date: " << (dateEditor.getText().trim().isNotEmpty() ? dateEditor.getText().trim() : "(missing)") << "\n";
    summary << "Location: " << (sessionLocationEditor.getText().trim().isNotEmpty() ? sessionLocationEditor.getText().trim() : "None") << "\n";
    summary << "Contributors: " << juce::String(static_cast<int>(contributorRows.size())) << "\n";
    summary << "Writer total: " << formatPercent(writerTotal()) << "   |   Publisher total: " << formatPercent(publisherTotal()) << "\n";
    summary << "Signature flow: " << (inviteToggle.getToggleState() ? "Invite links" : "In-session drawn signatures") << "\n";
    summary << "Typed signatures entered: ";

    int typedCount = 0;
    for (const auto& row : contributorRows)
    {
        if (row->typedSignatureName->getText().trim().isNotEmpty())
            ++typedCount;
    }

    summary << juce::String(typedCount) << "/" << juce::String(static_cast<int>(contributorRows.size())) << "\n";
    summary << "Drawn signatures captured: " << juce::String(signedCount) << "/" << juce::String(static_cast<int>(contributorRows.size())) << "\n";
    summary << "Recipients selected: " << juce::String(recipients.size()) << "\n";
    summary << "Agreement confirmed: " << (allPartiesAgreeToggle.getToggleState() ? "Yes" : "No");

    reviewSummaryLabel.setText(summary, juce::dontSendNotification);
}

void SplitSheetStudioEditor::refreshSubmitState()
{
    const auto message = validationMessage();
    const auto authed = isAuthenticated();
    submitButton.setEnabled(authed && message.isEmpty() && !restoringSession && currentStep == Step::review);
    validationLabel.setText(message.isNotEmpty() ? message : "Ready to send.",
                            juce::dontSendNotification);
    totalsLabel.setText("Writer total: " + formatPercent(writerTotal()) + "   |   Publisher total: " + formatPercent(publisherTotal()),
                        juce::dontSendNotification);
}

void SplitSheetStudioEditor::resetForm()
{
    songTitleEditor.clear();
    alternateTitleEditor.clear();
    dateEditor.setText(todayIso(), juce::dontSendNotification);
    sessionLocationEditor.clear();
    iswcEditor.clear();
    isrcEditor.clear();
    notesEditor.clear();
    additionalRecipientOneEditor.clear();
    additionalRecipientTwoEditor.clear();
    inviteToggle.setToggleState(true, juce::dontSendNotification);
    supersedesPreviousToggle.setToggleState(false, juce::dontSendNotification);
    allPartiesAgreeToggle.setToggleState(false, juce::dontSendNotification);

    while (contributorRows.size() > 1)
        removeContributorRow(static_cast<int>(contributorRows.size()) - 1);

    for (auto& row : contributorRows)
    {
        row->legalName->clear();
        row->role->setSelectedId(0, juce::dontSendNotification);
        row->address->clear();
        row->phone->clear();
        row->email->clear();
        row->pro->clear();
        row->ipi->clear();
        row->publisherName->clear();
        row->publisherIpi->clear();
        row->writerShare->clear();
        row->publisherShare->clear();
        row->typedSignatureName->clear();
        row->signaturePad->clear();
    }

    recipientSelections.assign(contributorRows.size(), true);
    switchStep(Step::song);
    refreshRecipientButtons();
    refreshReviewSummary();
    refreshSubmitState();
}

juce::String SplitSheetStudioEditor::validationMessage() const
{
    if (!isAuthenticated())
        return {};

    if (songTitleEditor.getText().trim().isEmpty())
        return "Enter the song title.";

    if (dateEditor.getText().trim().isEmpty())
        return "Enter the session date.";

    if (contributorRows.size() < 2)
        return "Add Contributor 2 to continue.";

    for (int index = 0; index < static_cast<int>(contributorRows.size()); ++index)
    {
        const auto& row = contributorRows[static_cast<size_t>(index)];
        const auto prefix = "Contributor " + juce::String(index + 1) + " ";

        if (row->legalName->getText().trim().isEmpty())
            return prefix + "needs a legal name.";
        if (row->role->getText().trim().isEmpty())
            return prefix + "needs a role.";
        if (row->email->getText().trim().isEmpty())
            return prefix + "needs an email.";
        if (row->writerShare->getText().trim().isEmpty())
            return prefix + "needs a writer share.";
        if (!inviteToggle.getToggleState())
        {
            if (row->typedSignatureName->getText().trim().isEmpty())
                return prefix + "needs a typed signature name.";
            if (!row->signaturePad->isSigned())
                return prefix + "needs a drawn signature.";
        }
    }

    if (std::abs(writerTotal() - 100.0) > 0.01)
        return "Writer shares must total exactly 100%.";

    if (std::abs(publisherTotal() - 100.0) > 0.01)
        return "Publisher shares must total exactly 100%. Leave them blank to mirror writer shares.";

    if (collectRecipientEmails().isEmpty())
        return "Select at least one recipient email.";

    if (!allPartiesAgreeToggle.getToggleState())
        return "Confirm that all parties reviewed and agree.";

    return {};
}

juce::var SplitSheetStudioEditor::buildSubmissionPayload() const
{
    auto* root = new juce::DynamicObject();
    root->setProperty("songTitle", songTitleEditor.getText().trim());
    root->setProperty("alternateTitle", alternateTitleEditor.getText().trim());
    root->setProperty("date", dateEditor.getText().trim());
    root->setProperty("sessionLocation", sessionLocationEditor.getText().trim());
    root->setProperty("iswc", iswcEditor.getText().trim());
    root->setProperty("isrc", isrcEditor.getText().trim());
    root->setProperty("notes", notesEditor.getText().trim());
    root->setProperty("supersedesPrevious", supersedesPreviousToggle.getToggleState());
    root->setProperty("allPartiesAgree", allPartiesAgreeToggle.getToggleState());
    root->setProperty("collectSignaturesByInvite", inviteToggle.getToggleState());

    juce::Array<juce::var> recipients;
    for (const auto& email : collectRecipientEmails())
        recipients.add(email);
    root->setProperty("recipientEmails", juce::var(recipients));

    juce::Array<juce::var> contributors;
    for (const auto& row : contributorRows)
    {
        auto* contributor = new juce::DynamicObject();
        contributor->setProperty("legalName", row->legalName->getText().trim());
        contributor->setProperty("role", row->role->getText().trim());
        contributor->setProperty("address", row->address->getText().trim());
        contributor->setProperty("phone", row->phone->getText().trim());
        contributor->setProperty("email", row->email->getText().trim());
        contributor->setProperty("pro", row->pro->getText().trim());
        contributor->setProperty("ipi", row->ipi->getText().trim());
        contributor->setProperty("publisherName", row->publisherName->getText().trim());
        contributor->setProperty("publisherIpi", row->publisherIpi->getText().trim());
        contributor->setProperty("writerShare", shareValue(row->writerShare->getText()));
        contributor->setProperty("publisherShare", effectivePublisherShare(*row->writerShare, *row->publisherShare));
        contributor->setProperty("typedSignatureName", row->typedSignatureName->getText().trim());
        contributor->setProperty("signatureData", row->signaturePad->toDataUrl());
        contributors.add(juce::var(contributor));
    }

    root->setProperty("contributors", juce::var(contributors));
    return juce::var(root);
}

juce::StringArray SplitSheetStudioEditor::collectRecipientEmails() const
{
    juce::StringArray recipients;

    for (size_t index = 0; index < contributorRows.size(); ++index)
    {
        if (index < recipientSelections.size() && recipientSelections[index])
        {
            const auto email = contributorRows[index]->email->getText().trim();
            if (email.isNotEmpty())
                recipients.addIfNotAlreadyThere(email);
        }
    }

    for (const auto& email : parseEmailTokens(additionalRecipientOneEditor.getText()))
        recipients.addIfNotAlreadyThere(email);
    for (const auto& email : parseEmailTokens(additionalRecipientTwoEditor.getText()))
        recipients.addIfNotAlreadyThere(email);

    return recipients;
}

double SplitSheetStudioEditor::writerTotal() const
{
    double total = 0.0;
    for (const auto& row : contributorRows)
        total += shareValue(row->writerShare->getText());
    return total;
}

double SplitSheetStudioEditor::publisherTotal() const
{
    double total = 0.0;
    for (const auto& row : contributorRows)
        total += effectivePublisherShare(*row->writerShare, *row->publisherShare);
    return total;
}

bool SplitSheetStudioEditor::isAuthenticated() const
{
    return processor.getAccessToken().isNotEmpty() || processor.getRefreshToken().isNotEmpty();
}

void SplitSheetStudioEditor::populateSignedInDefaults()
{
    const auto display = processor.getDisplayName().isNotEmpty() ? processor.getDisplayName() : processor.getUserEmail();
    welcomeLabel.setText("Signed in as " + display, juce::dontSendNotification);
}
