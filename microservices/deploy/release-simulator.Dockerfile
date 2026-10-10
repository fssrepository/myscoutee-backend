# The canonical dev image owns Python/OpenSSL; package its existing fixture files.
FROM myscoutee-service-release-simulator-base:msc121
COPY --from=backend-source server/docker/scripts/start_release_simulator.sh /workspace/server/docker/scripts/start_release_simulator.sh
COPY --from=backend-source guides/qa/tools/operator-update-release-server.py /workspace/guides/qa/tools/operator-update-release-server.py
