module.exports = {
    extends: ['airbnb-typescript-prettier'],
    rules: {
        'import/prefer-default-export': 'off',
        'prettier/prettier': 'warn',
        'import/prefer-default-export': 0,
        'class-methods-use-this': 0,
        'import/no-extraneous-dependencies': 0,
        "react/destructuring-assignment": 0,
        'react/jsx-props-no-spreading': 0,
        'react/no-array-index-key': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        'react/require-default-props': [1, { forbidDefaultForRequired: true, ignoreFunctionalComponents: true }],
        'import/no-absolute-path': 'off',
        'react-hooks/exhaustive-deps': 0,
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['src', 'components'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
