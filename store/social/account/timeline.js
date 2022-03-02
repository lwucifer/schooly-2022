import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import {
  POSTS as ENDPOINT_POSTS,
  SOCIAL_USERS as ENDPOINT_SOCIAL_USERS,
} from "~/utils/endpoints";
import { PAGE_SIZE, POST_TYPES } from "~/utils/constants";
import Posts from "~/services/social/Posts";

/**
 * initial state
 */
const state = () => ({
  posts: [],
});

/**
 * initial getters
 */
const getters = {
  post: (state) => (id) => state.posts.find((post) => post.id === id),
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ACCOUNT_TIMELINE.GET_POSTS](
    { commit },
    { uuid, params = {} } = {}
  ) {
    try {
      const result = await this.$axios.$get(
        `${ENDPOINT_SOCIAL_USERS}/${uuid}/posts`,
        {
          params,
        }
      );
      const { data = [] } = result;
      const newPosts = data.map((post) => ({
        ...post,
        $commentTree: [],
      }));

      commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      return result;
    } catch (err) {
      console.log("ACCOUNT_TIMELINE.GET_POSTS err", err);
      return err;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.GET_POSTS_INIFINITE](
    { state, commit },
    { uuid, params = {} } = {}
  ) {
    try {
      const { fetchSize = PAGE_SIZE.DEFAULT } = params || {};
      const result = await this.$axios.$get(
        `${ENDPOINT_SOCIAL_USERS}/${uuid}/posts`,
        {
          params: {
            fetch_size: fetchSize,
            ...params,
          },
        }
      );
      const { data = [] } = result;
      const newPosts = data.map((post) => ({
        ...post,
        $commentTree: [],
      }));

      commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, [
        ...state.posts,
        ...newPosts,
      ]);
      return result;
    } catch (err) {
      console.log("ACCOUNT_TIMELINE.GET_POSTS_INIFINITE err", err);
      return err;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.ADD_POST]({ state, commit }, payload) {
    try {
      const result = await new Posts(this.$axios)[actionTypes.BASE.ADD](
        payload
      );

      if (!result.error) {
        const { type, shared_post_id } = payload;
        const newPost = {
          ...result.data,
          $commentTree: [],
        };
        let newPosts = [newPost, ...state.posts];

        if (type === POST_TYPES.SHARE) {
          newPosts = newPosts.map((post) => {
            if (post.id === shared_post_id) {
              return {
                ...post,
                counter: {
                  ...post.counter,
                  share: post.counter.share + 1,
                },
              };
            }
            return post;
          });
        }

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }
      return result;
    } catch (err) {
      console.log("ADD_POST err", err);
      return err;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.EDIT_POST](
    { state, commit },
    { postId, model } = {}
  ) {
    try {
      const { data: result = {} } = await new Posts(this.$axios)[
        actionTypes.BASE.PATCH
      ](postId, model);

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              ...(result.data || {}),
            };
          }

          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.DELETE_POST]({ state, commit }, payload) {
    try {
      const result = await new Posts(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );

      if (!result.error) {
        const newPosts = state.posts.filter((item) => item.id !== payload);
        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.LIKE_POST](
    { state, commit },
    { postId, model }
  ) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/reactions`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              counter: {
                ...post.counter,
                reaction: post.counter.reaction + 1,
              },
              reaction: {
                created_at: data.created_at,
                emoji: data.emoji,
              },
            };
          }
          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.DELETE_LIKE_POST](
    { state, commit },
    { postId, model }
  ) {
    try {
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/reactions`,
        data: model,
        method: "DELETE",
      });

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              counter: {
                ...post.counter,
                reaction: post.counter.reaction - 1,
              },
              reaction: null,
            };
          }
          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.GET_COMMENT](
    { state, commit },
    payload = {}
  ) {
    try {
      const { id, ...params } = payload;
      const result = await this.$axios.$get(
        `${ENDPOINT_POSTS}/${id}/comments`,
        {
          params,
        }
      );

      if (!result.error) {
        const { data = [] } = result;

        const newPosts = state.posts.map((post) => {
          if (post.id === id) {
            const newCommentTree = [
              ...get(post, "$commentTree", []),
              ...data.map((item) => ({
                ...item,
                $children: [],
              })),
            ];

            return {
              ...post,
              $commentTree: newCommentTree,
            };
          } else {
            return post;
          }
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.ADD_COMMENT](
    { state, commit },
    { postId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/comments`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;

        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              counter: {
                ...post.counter,
                comment: post.counter.comment + 1,
              },
              $commentTree: [{ ...data, $children: [] }, ...post.$commentTree],
            };
          } else {
            return post;
          }
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.EDIT_COMMENT](
    { state, commit },
    { postId, commentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              $commentTree: post.$commentTree.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    ...(result.data || {}),
                  };
                }

                return comment;
              }),
            };
          }

          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.DELETE_COMMENT](
    { state, commit },
    { id, postId } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        `${ENDPOINT_POSTS}/${postId}/comments/${id}`
      );

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const deletedComment = post.$commentTree.find(
              (comment) => comment.id === id
            );
            const commentChildCount = deletedComment.$children
              ? deletedComment.$children.length
              : 0;

            return {
              ...post,
              counter: {
                ...post.counter,
                comment: post.counter.comment - (commentChildCount + 1),
              },
              $commentTree: post.$commentTree.filter(
                (comment) => comment.id !== id
              ),
            };
          }
          return post;
        });
        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.LIKE_COMMENT](
    { state, commit },
    { postId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const newCommentTree = post.$commentTree.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  counter: {
                    ...comment.counter,
                    reaction: comment.counter.reaction + 1,
                  },
                  reaction: {
                    created_at: data.created_at,
                    emoji: data.emoji,
                  },
                };
              }
              return comment;
            });

            return {
              ...post,
              $commentTree: newCommentTree,
            };
          }
          return post;
        });
        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.DELETE_LIKE_COMMENT](
    { state, commit },
    { postId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        data: model,
        method: "DELETE",
      });

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const newCommentTree = post.$commentTree.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  counter: {
                    ...comment.counter,
                    reaction: comment.counter.reaction - 1,
                  },
                  reaction: null,
                };
              }
              return comment;
            });

            return {
              ...post,
              $commentTree: newCommentTree,
            };
          }
          return post;
        });
        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.GET_CHILD_COMMENT](
    { state, commit },
    { postId, commentId, fromId, size } = {}
  ) {
    try {
      const result = await this.$axios.$get(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/comments`,
        {
          params: { from_comment_id: fromId, fetch_size: size },
        }
      );

      if (!result.error) {
        const { data = [] } = result;

        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const newCommentTree = post.$commentTree.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  $children: [...comment.$children, ...data],
                };
              } else {
                return comment;
              }
            });

            return {
              ...post,
              $commentTree: newCommentTree,
            };
          } else {
            return post;
          }
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.ADD_CHILD_COMMENT](
    { state, commit },
    { postId, commentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/comments`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              counter: {
                ...post.counter,
                comment: post.counter.comment + 1,
              },
              $commentTree: post.$commentTree.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    counter: {
                      ...comment.counter,
                      comment: comment.counter.comment + 1,
                    },
                    $children: [data, ...comment.$children],
                  };
                }
                return comment;
              }),
            };
          }
          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.EDIT_CHILD_COMMENT](
    { state, commit },
    { postId, commentId, parentCommentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const newCommentTree = post.$commentTree.map((comment) => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  $children: comment.$children.map((item) => {
                    if (item.id === commentId) {
                      return {
                        ...item,
                        ...(result.data || {}),
                      };
                    }
                    return item;
                  }),
                };
              }

              return comment;
            });

            return {
              ...post,
              $commentTree: newCommentTree,
            };
          }

          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.DELETE_CHILD_COMMENT](
    { state, commit },
    { id, postId, parentCommentId } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${id}`
      );

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const newCommentTree = post.$commentTree.map((comment) => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  counter: {
                    ...comment.counter,
                    comment: comment.counter.comment - 1,
                  },
                  $children: comment.$children.filter((item) => item.id !== id),
                };
              }

              return comment;
            });

            return {
              ...post,
              counter: {
                ...post.counter,
                comment: post.counter.comment - 1,
              },
              $commentTree: newCommentTree,
            };
          }

          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.LIKE_CHILD_COMMENT](
    { state, commit },
    { postId, parentCommentId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const newCommentTree = post.$commentTree.map((comment) => {
              if (comment.id === parentCommentId) {
                const newChildren = comment.$children.map((item) => {
                  if (item.id === commentId) {
                    return {
                      ...item,
                      counter: {
                        ...item.counter,
                        reaction: item.counter.reaction + 1,
                      },
                      reaction: {
                        created_at: data.created_at,
                        emoji: data.emoji,
                      },
                    };
                  }
                  return item;
                });

                return {
                  ...comment,
                  $children: newChildren,
                };
              }
              return comment;
            });

            return {
              ...post,
              $commentTree: newCommentTree,
            };
          }
          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.DELETE_LIKE_CHILD_COMMENT](
    { state, commit },
    { postId, parentCommentId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        data: model,
        method: "DELETE",
      });

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            const newCommentTree = post.$commentTree.map((comment) => {
              if (comment.id === parentCommentId) {
                const newChildren = comment.$children.map((item) => {
                  if (item.id === commentId) {
                    return {
                      ...item,
                      counter: {
                        ...item.counter,
                        reaction: item.counter.reaction - 1,
                      },
                      reaction: null,
                    };
                  }
                  return item;
                });

                return {
                  ...comment,
                  $children: newChildren,
                };
              }
              return comment;
            });

            return {
              ...post,
              $commentTree: newCommentTree,
            };
          }
          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.EDIT_POST_TAGS](
    { state, commit },
    { postId, tags } = {}
  ) {
    try {
      const result = await this.$axios.$put(
        `${ENDPOINT_POSTS}/${postId}/tags`,
        { tags }
      );

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              tags: [...(result.data || [])],
            };
          }
          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ACCOUNT_TIMELINE.EDIT_POST_PRIVACY](
    { state, commit },
    { postId, privacy = {} } = {}
  ) {
    try {
      const result = await this.$axios.$put(
        `${ENDPOINT_POSTS}/${postId}/privacy`,
        {
          ...privacy,
        }
      );

      if (!result.error) {
        const newPosts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              ...(result.data || {}),
            };
          }
          return post;
        });

        commit(mutationTypes.ACCOUNT_TIMELINE.SET_POSTS, newPosts);
      }

      return result;
    } catch (error) {
      return error;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ACCOUNT_TIMELINE.SET_POSTS](state, _posts) {
    state.posts = _posts;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
