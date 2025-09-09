FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    curl git unzip xz-utils zip libglu1-mesa openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# Instalação do Flutter
ENV FLUTTER_VERSION=3.22.0
RUN git clone https://github.com/flutter/flutter.git /flutter --branch stable

# Criação do usuário não-root
RUN useradd -ms /bin/bash devuser

# Permissões do Flutter para devuser
RUN mkdir -p /flutter/.pub-cache && chown -R devuser:devuser /flutter /flutter/.pub-cache

# Instalação do Android SDK
ENV ANDROID_SDK_ROOT=/android-sdk
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    curl -o sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip sdk.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
    rm sdk.zip && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest && \
    yes | $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --sdk_root=$ANDROID_SDK_ROOT "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Instalação do Gradle
ENV GRADLE_VERSION=8.7
RUN curl -sL https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -o gradle.zip && \
    unzip gradle.zip -d /opt && \
    rm gradle.zip

# Exporta PATH para todos os shells do devuser
RUN echo 'export PATH=/flutter/bin:/flutter/bin/cache/dart-sdk/bin:/opt/gradle-${GRADLE_VERSION}/bin:$PATH' >> /home/devuser/.bashrc

# Define PATH global
ENV PATH="/flutter/bin:/flutter/bin/cache/dart-sdk/bin:/opt/gradle-${GRADLE_VERSION}/bin:${PATH}"

USER devuser
WORKDIR /app

# Volumes para cache
VOLUME ["/app", "/flutter/.pub-cache", "/android-sdk", "/app/build"]

CMD ["/bin/bash"]