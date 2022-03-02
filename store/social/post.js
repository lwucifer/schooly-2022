import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { POSTS as ENDPOINT_POSTS } from "~/utils/endpoints";
import Posts from "~/services/social/Posts";

/**
 * initial state
 */
const state = () => ({
  post: {
    $commentTree: [],
  },
  checkShowMoreTop: 0,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SOCIAL_POST.GET_POST]({ commit }, payload) {
    try {
      const result = await new Posts(this.$axios)[actionTypes.BASE.DETAIL](
        payload
      );

      commit(mutationTypes.SOCIAL_POST.SET_POST, {
        ...(result.data || {}),
        $commentTree: [],
      });
      return result;
    } catch (err) {
      return err;
    }
  },

  async [actionTypes.SOCIAL_POST.EDIT_POST](
    { state, commit },
    { postId, model } = {}
  ) {
    try {
      const { data: result = {} } = await new Posts(this.$axios)[
        actionTypes.BASE.PATCH
      ](postId, model);

      if (!result.error) {
        commit(mutationTypes.SOCIAL_POST.SET_POST, {
          ...state.post,
          ...(result.data || {}),
        });
      }

      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.DELETE_POST]({ state, commit }, payload) {
    try {
      const result = await new Posts(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );

      if (!result.error) {
        commit(mutationTypes.SOCIAL_POST.SET_POST, {});
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.LIKE_POST](
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
        const { post = {} } = state;
        const newPost = {
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

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.DELETE_LIKE_POST](
    { state, commit },
    { postId, model }
  ) {
    try {
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/reactions`,
        data: model,
        method: "DELETE"
      });

      if (!result.error) {
        const { post = {} } = state;
        const newPost = {
          ...post,
          counter: {
            ...post.counter,
            reaction: post.counter.reaction - 1,
          },
          reaction: null,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.GET_COMMENT]({ state, commit }, payload = {}) {
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
        const { post = {} } = state;

        const newPost = {
          ...post,
          $commentTree: [
            ...get(post, "$commentTree", []),
            ...data.map((item) => ({
              ...item,
              $children: [],
            })),
          ],
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.GET_COMMENT_BEFORE](
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
        const { post = {} } = state;

        const newPost = {
          ...post,
          $commentTree: [
            ...data.map((item) => ({
              ...item,
              $children: [],
            })),
            ...get(post, "$commentTree", []),
          ],
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.CHECK_SHOW_MORE_TOP](
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
        commit(mutationTypes.SOCIAL_POST.SET_SHOW_MORE_TOP, result.data.length);
      }
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.ADD_COMMENT](
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
        const { post = {} } = state;

        const newPost = {
          ...post,
          counter: {
            ...post.counter,
            comment: post.counter.comment + 1,
          },
          $commentTree: [{ ...data, $children: [] }, ...post.$commentTree],
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.EDIT_COMMENT](
    { state, commit },
    { postId, commentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const { post = {} } = state;

        const newPost = {
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

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.DELETE_COMMENT](
    { state, commit },
    { id, postId } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        `${ENDPOINT_POSTS}/${postId}/comments/${id}`
      );

      if (!result.error) {
        const { post = {} } = state;

        const deletedComment = post.$commentTree.find(
          (comment) => comment.id === id
        );
        const commentChildCount = deletedComment.$children
          ? deletedComment.$children.length
          : 0;

        const newPost = {
          ...post,
          counter: {
            ...post.counter,
            comment: post.counter.comment - (commentChildCount + 1),
          },
          $commentTree: post.$commentTree.filter(
            (comment) => comment.id !== id
          ),
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.LIKE_COMMENT](
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
        const { post = {} } = state;

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

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.DELETE_LIKE_COMMENT](
    { state, commit },
    { postId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url:`${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        data: model,
        method: "DELETE"
      });

      if (!result.error) {
        const { post = {} } = state;

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

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.GET_CHILD_COMMENT](
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
        const { post = {} } = state;

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

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.ADD_CHILD_COMMENT](
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
        const { post = {} } = state;

        const newPost = {
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

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.EDIT_CHILD_COMMENT](
    { state, commit },
    { postId, commentId, parentCommentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const { post = {} } = state;

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

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.DELETE_CHILD_COMMENT](
    { state, commit },
    { id, postId, parentCommentId } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${id}`
      );

      if (!result.error) {
        const { post = {} } = state;

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

        const newPost = {
          ...post,
          counter: {
            ...post.counter,
            comment: post.counter.comment - 1,
          },
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.LIKE_CHILD_COMMENT](
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
        const { post = {} } = state;

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

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.DELETE_LIKE_CHILD_COMMENT](
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
        const { post = {} } = state;

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

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.SOCIAL_POST.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.EDIT_POST_TAGS](
    { state, commit },
    { postId, tags } = {}
  ) {
    try {
      const result = await this.$axios.$put(
        `${ENDPOINT_POSTS}/${postId}/tags`,
        { tags }
      );

      if (!result.error) {
        commit(mutationTypes.SOCIAL_POST.SET_POST, {
          ...state.post,
          tags: [
            ...(result.data || []),
          ]
        });
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_POST.EDIT_POST_PRIVACY](
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
        commit(mutationTypes.SOCIAL_POST.SET_POST, {
          ...state.post,
          ...(result.data || {}),
        });
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
  [mutationTypes.SOCIAL_POST.SET_POST](state, _post) {
    state.post = _post;
  },
  [mutationTypes.SOCIAL_POST.SET_SHOW_MORE_TOP](state, _data) {
    state.checkShowMoreTop = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
