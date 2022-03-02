import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { POSTS as ENDPOINT_POSTS } from "~/utils/endpoints";
import { SOCIAL_DEFAULT_FETCH_SIZE, POST_TYPES } from "~/utils/constants";
import Posts from "~/services/social/Posts";
import Feeds from "~/services/social/Feeds";

/**
 * initial state
 */
const state = () => ({
  feeds: [],
});

/**
 * initial getters
 */
const getters = {
  post: (state) => (id) => state.feeds.find((post) => post.id === id),
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.NEWFEED.GET_FEEDS]({ commit }, payload) {
    try {
      const result = await new Feeds(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      const { data = [] } = result;
      const newFeeds = data.map((post) => ({
        ...post,
        $commentTree: [],
      }));

      commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      return result;
    } catch (err) {
      return err;
    }
  },

  async [actionTypes.NEWFEED.GET_FEEDS_INFINITE](
    { state, commit },
    { fetchSize = SOCIAL_DEFAULT_FETCH_SIZE, fromPostId = null } = {}
  ) {
    try {
      const result = await new Feeds(this.$axios)[actionTypes.BASE.LIST]({
        params: {
          fetch_size: fetchSize,
          from_post_id: fromPostId,
        },
      });
      const { data = [] } = result;
      const newFeeds = data.map((post) => ({
        ...post,
        $commentTree: [],
      }));

      commit(mutationTypes.NEWFEED.SET_FEEDS, [...state.feeds, ...newFeeds]);
      return result;
    } catch (err) {
      return err;
    }
  },

  async [actionTypes.NEWFEED.ADD_POST]({ state, commit }, payload) {
    try {
      const result = await new Posts(this.$axios)[actionTypes.BASE.ADD](payload);

      if (!result.error) {
        const { type, shared_post_id } = payload;
        const newPost = {
          ...result.data,
          $commentTree: [],
        };
        let newFeeds = [newPost, ...state.feeds];

        if (type === POST_TYPES.SHARE) {
          newFeeds = newFeeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  async [actionTypes.NEWFEED.EDIT_POST](
    { state, commit },
    { postId, model } = {}
  ) {
    try {
      const { data: result = {} } = await new Posts(this.$axios)[
        actionTypes.BASE.PATCH
      ](postId, model);

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              ...(result.data || {}),
            };
          }

          return post;
        });

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async [actionTypes.NEWFEED.DELETE_POST]({ state, commit }, payload) {
    try {
      const result = await new Posts(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );

      if (!result.error) {
        const newFeeds = state.feeds.filter((item) => item.id !== payload);
        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.LIKE_POST]({ state, commit }, { postId, model }) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/reactions`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.DELETE_LIKE_POST](
    { state, commit },
    { postId, model }
  ) {
    try {
      console.table('actionTypes.NEWFEED.DELETE_LIKE_POST', model)
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/reactions`,
        data: model,
        method: "DELETE"
      });

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.GET_COMMENT]({ state, commit }, payload = {}) {
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

        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.ADD_COMMENT](
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

        const newFeeds = state.feeds.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              counter: {
                ...post.counter,
                comment: post.counter.comment + 1
              },
              $commentTree: [{ ...data, $children: [] }, ...post.$commentTree],
            };
          } else {
            return post;
          }
        });

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.EDIT_COMMENT](
    { state, commit },
    { postId, commentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.DELETE_COMMENT](
    { state, commit },
    { id, postId } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        `${ENDPOINT_POSTS}/${postId}/comments/${id}`
      );

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
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
        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.LIKE_COMMENT](
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
        const newFeeds = state.feeds.map((post) => {
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
        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.DELETE_LIKE_COMMENT](
    { state, commit },
    { postId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        data: model,
        method: "DELETE"
      });

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
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
        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.GET_CHILD_COMMENT](
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

        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.ADD_CHILD_COMMENT](
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
        const newFeeds = state.feeds.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              counter: {
                ...post.counter,
                comment: post.counter.comment + 1
              },
              $commentTree: post.$commentTree.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    counter: {
                      ...comment.counter,
                      comment: comment.counter.comment + 1
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.EDIT_CHILD_COMMENT](
    { state, commit },
    { postId, commentId, parentCommentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.DELETE_CHILD_COMMENT](
    { state, commit },
    { id, postId, parentCommentId } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${id}`
      );

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.LIKE_CHILD_COMMENT](
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
        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.DELETE_LIKE_CHILD_COMMENT](
    { state, commit },
    { postId, parentCommentId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        data: model,
        method: "DELETE"
      });

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
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

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.EDIT_POST_TAGS](
    { state, commit },
    { postId, tags } = {}
  ) {
    try {
      const result = await this.$axios.$put(
        `${ENDPOINT_POSTS}/${postId}/tags`,
        { tags }
      );

      if (!result.error) {
        const newFeeds = state.feeds.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              tags: [
                ...(result.data || []),
              ]
            };
          }
          return post;
        });

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.NEWFEED.EDIT_POST_PRIVACY](
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
        const newFeeds = state.feeds.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              ...(result.data || {}),
            };
          }
          return post;
        });

        commit(mutationTypes.NEWFEED.SET_FEEDS, newFeeds);
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
  [mutationTypes.NEWFEED.SET_FEEDS](state, _feeds) {
    state.feeds = _feeds;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
