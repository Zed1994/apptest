FROM image-docker.zuoyebang.cc/base/node-builder:14.17.4-slim as builder

WORKDIR /output
WORKDIR /home/homework/
COPY . /home/homework/
RUN npm install --registry=http://ued.zuoyebang.cc/npm/
ARG CI_FE_DEBUG
ARG REPO_GIT_REMOTE_ADDRESS
ARG CI_COMMIT_SHA
RUN if [ "$CI_FE_DEBUG" = "true" ] ; then npm run build:test ; else npm run build:online ; fi

# 运行
FROM image-docker.zuoyebang.cc/privbase/fe-nginx:1.2.6-cos

ARG APP_NAME
ENV APP_NAME $APP_NAME
ARG REPO_NAME
ENV REPO_NAME $REPO_NAME
# 仅用于通用的前端，部分前端视情况来组织目录结构
COPY --from=builder /home/homework/dist/ /home/homework/www/

COPY ./location.d/ /etc/nginx/location.d/
